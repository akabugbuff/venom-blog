/**
 * migrate-posts.mjs — 将现有 Markdown 文章导入 Supabase
 *
 * 用法:
 *   node scripts/migrate-posts.mjs
 *
 * 需要先配置 .env 中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
 * 运行后需要输入管理员邮箱和密码来获取写入权限
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');

// 从 .env 读取（简单解析）
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ 未找到 .env 文件，请先创建并配置 Supabase 信息');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return vars;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请在 .env 中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** 简易 YAML frontmatter 解析（与 posts.ts 中相同） */
function parseFrontmatter(raw) {
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith('---')) return { data: {}, content: raw };
  const end = trimmed.indexOf('---', 3);
  if (end === -1) return { data: {}, content: raw };
  const fmBlock = trimmed.slice(3, end).trim();
  const content = trimmed.slice(end + 3).trim();
  const data = {};
  const lines = fmBlock.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (typeof value === 'string' && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    }
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    data[key] = value;
  }
  return { data, content };
}

function computeReadingTime(text) {
  const wpm = 200;
  return Math.max(1, Math.ceil(text.split(/\s+/).length / wpm));
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   📥  文章迁移：Markdown → Supabase  ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // 管理员登录
  console.log('需要管理员权限才能写入数据库。');
  const email = await ask(rl, '📧 管理员邮箱：');
  const password = await ask(rl, '🔑 密码：');

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) {
    console.error('❌ 登录失败:', authError.message);
    rl.close();
    process.exit(1);
  }
  console.log('✅ 登录成功\n');

  // 读取所有 .md 文件
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('⚠️  posts/ 目录下没有 .md 文件');
    rl.close();
    process.exit(0);
  }

  console.log(`📂 找到 ${files.length} 篇文章:\n`);

  // 先获取现有分类和标签
  const { data: existingCategories } = await supabase.from('categories').select('*');
  const { data: existingTags } = await supabase.from('tags').select('*');

  const catMap = {};
  for (const c of (existingCategories ?? [])) catMap[c.slug] = c;

  const tagMap = {};
  for (const t of (existingTags ?? [])) tagMap[t.name] = t;

  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data: fm, content } = parseFrontmatter(raw);
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

    console.log(`  📄 ${fm.title || file}`);

    // 检查是否已存在
    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).single();
    if (existing) {
      console.log(`     ⏭️  已存在 (slug: ${slug})，跳过`);
      skipped++;
      continue;
    }

    // 查找或创建分类
    let categoryId = null;
    const catSlug = fm.category;
    if (catSlug && catMap[catSlug]) {
      categoryId = catMap[catSlug].id;
    } else if (catSlug) {
      console.log(`     ⚠️  分类 "${catSlug}" 不存在，跳过分类关联`);
    }

    // 查找或创建标签
    const tagIds = [];
    const tagNames = fm.tags ?? [];
    for (const tagName of tagNames) {
      if (tagMap[tagName]) {
        tagIds.push(tagMap[tagName].id);
      } else {
        // 创建新标签
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const { data: newTag, error: tagErr } = await supabase
          .from('tags')
          .insert({ name: tagName, slug: tagSlug })
          .select()
          .single();
        if (!tagErr && newTag) {
          tagMap[tagName] = newTag;
          tagIds.push(newTag.id);
          console.log(`     🏷️  新建标签: ${tagName}`);
        }
      }
    }

    // 插入文章
    const { error: postErr } = await supabase.from('posts').insert({
      title: fm.title || 'Untitled',
      slug,
      description: fm.description || '',
      content,
      category_id: categoryId,
      status: fm.draft ? 'draft' : 'published',
      reading_time: computeReadingTime(content),
      published_at: fm.draft ? null : (fm.date ? `${fm.date}T00:00:00Z` : new Date().toISOString()),
    });

    if (postErr) {
      console.log(`     ❌ 导入失败: ${postErr.message}`);
      continue;
    }

    // 关联标签
    if (tagIds.length > 0) {
      const { data: newPost } = await supabase.from('posts').select('id').eq('slug', slug).single();
      if (newPost) {
        await supabase.from('post_tags').insert(
          tagIds.map((tagId) => ({ post_id: newPost.id, tag_id: tagId }))
        );
      }
    }

    console.log(`     ✅ 导入成功 (slug: ${slug}, ${fm.draft ? '草稿' : '已发布'})`);
    imported++;
  }

  console.log('');
  console.log(`🎉 迁移完成！导入 ${imported} 篇，跳过 ${skipped} 篇`);
  console.log('');
  console.log('现在可以访问后台 http://localhost:5173/#/admin/posts 查看');

  await supabase.auth.signOut();
  rl.close();
}

main().catch((err) => {
  console.error('❌ 出错了:', err.message);
  process.exit(1);
});
