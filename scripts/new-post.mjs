/**
 * new-post.mjs — 交互式新建文章脚本
 *
 * 用法:
 *   npm run new:post
 *
 * 运行后按提示输入文章信息，自动在 posts/ 目录生成 .md 文件。
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

// ── 工具函数 ──

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const CATEGORIES_FILE = path.join(ROOT, 'src', 'lib', 'categories.ts');

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

/** 解析 categories.ts 提取分类列表 */
function parseCategories() {
  const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
  const categories = [];

  // 匹配每个分类对象 { slug, name, icon, description }
  const blockRegex = /\{\s*slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*icon:\s*'([^']+)',\s*description:\s*'([^']+)',?\s*\}/g;
  let match;
  while ((match = blockRegex.exec(raw)) !== null) {
    categories.push({
      slug: match[1],
      name: match[2],
      icon: match[3],
      description: match[4],
    });
  }

  return categories;
}

/** 检测是否包含中文 */
function hasChinese(str) {
  return /[一-龥]/.test(str);
}

/** 生成日期 YYYY-MM-DD */
function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** 简单中文转拼音 slug（仅覆盖常见安全词汇） */
const PINYIN_MAP = {
  'xss': 'xss',
  'sql注入': 'sql-injection',
  'csrf': 'csrf',
  'ssrf': 'ssrf',
  'ddos': 'ddos',
  'redis': 'redis',
  'dvwa': 'dvwa',
  'aes': 'aes',
  'rsa': 'rsa',
  'des': 'des',
  'md5': 'md5',
  'sha': 'sha',
  'waf': 'waf',
  'vpn': 'vpn',
  'dns': 'dns',
  'http': 'http',
  'https': 'https',
  'ssh': 'ssh',
  'ftp': 'ftp',
  'sql': 'sql',
  'xss攻击': 'xss-attack',
  'sql注入': 'sql-injection',
  '文件上传': 'file-upload',
  '文件包含': 'file-inclusion',
  '命令注入': 'command-injection',
  '反序列化': 'deserialization',
  '提权': 'privilege-escalation',
  '横向移动': 'lateral-movement',
  '端口扫描': 'port-scan',
  '漏洞扫描': 'vulnerability-scan',
  '暴力破解': 'brute-force',
  '社会工程学': 'social-engineering',
  '缓冲区溢出': 'buffer-overflow',
  '格式化字符串': 'format-string',
  '栈溢出': 'stack-overflow',
  '堆溢出': 'heap-overflow',
  'rop': 'rop',
  'shellcode': 'shellcode',
  '逆向': 'reverse-engineering',
  '密码': 'password',
  '加密': 'encryption',
  '解密': 'decryption',
  '数字签名': 'digital-signature',
  '证书': 'certificate',
  '实验': 'lab',
  '记录': 'notes',
  '笔记': 'notes',
  '总结': 'summary',
  '入门': 'intro',
  '基础': 'basics',
  '进阶': 'advanced',
  '实战': 'practice',
  '分析': 'analysis',
  '防御': 'defense',
  '安全': 'security',
  '配置': 'config',
  '部署': 'deploy',
  '备份': 'backup',
  '恢复': 'recovery',
  '网络': 'network',
  '系统': 'system',
  'windows': 'windows',
  'linux': 'linux',
  'web': 'web',
  '渗透': 'penetration',
  '审计': 'audit',
  '日志': 'log',
  '检测': 'detection',
  '响应': 'response',
  '应急': 'incident',
  '加固': 'hardening',
  'docker': 'docker',
  '容器': 'container',
  'kubernetes': 'k8s',
};

/** 将中文标题转为建议的英文 slug */
function suggestSlug(title) {
  // 先尝试匹配已知词汇
  let slug = title.toLowerCase();

  // 移除标点
  slug = slug.replace(/[，,。.！!？?：:；;、""''（）()【】\[\]《》<>]/g, ' ');
  slug = slug.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  // 替换已知中文词汇
  for (const [cn, en] of Object.entries(PINYIN_MAP)) {
    slug = slug.replaceAll(cn, en);
  }

  // 如果还有中文残留，返回空（让用户手动输入）
  if (hasChinese(slug)) return '';

  return slug || '';
}

// ── 主流程 ──

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║     📝  新建博客文章                ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 1. 文章标题
  const title = await ask(rl, '📌 文章标题：');
  if (!title) {
    console.log('❌ 标题不能为空，已取消。');
    rl.close();
    process.exit(0);
  }

  // 2. 处理 slug
  let slug = '';
  if (hasChinese(title)) {
    const suggested = suggestSlug(title);
    if (suggested) {
      const useAuto = await ask(rl, `🔗 自动生成 slug: "${suggested}"  按回车确认，或输入自定义 slug：`);
      slug = useAuto || suggested;
    } else {
      slug = await ask(rl, '🔗 检测到中文标题，请输入英文 slug（如 dvwa-sql-lab）：');
      if (!slug) {
        console.log('❌ slug 不能为空，已取消。');
        rl.close();
        process.exit(0);
      }
    }
  } else {
    // 英文标题，自动生成 slug
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    console.log(`🔗 自动生成 slug: "${slug}"`);
  }

  // 3. 文章描述
  const description = await ask(rl, '📄 文章描述（一句话概括）：');
  if (!description) {
    console.log('❌ 描述不能为空，已取消。');
    rl.close();
    process.exit(0);
  }

  // 4. 选择分类
  const categories = parseCategories();
  console.log('');
  console.log('📂 可用分类：');
  categories.forEach((c, i) => {
    console.log(`  [${i + 1}] ${c.icon} ${c.name} (${c.slug}) — ${c.description}`);
  });
  console.log('  [0] 不设置分类');

  const catChoice = await ask(rl, '请选择分类编号：');
  const catIndex = parseInt(catChoice, 10);
  let category = '';
  if (catIndex >= 1 && catIndex <= categories.length) {
    category = categories[catIndex - 1].slug;
    console.log(`  ✅ 已选择: ${categories[catIndex - 1].name}`);
  } else {
    console.log('  ℹ️  未设置分类');
  }

  // 5. 标签
  const tagsInput = await ask(rl, '🏷️  标签（多个用逗号分隔，如 XSS, 防御, DVWA）：');
  const tags = tagsInput
    ? tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `"${t}"`)
        .join(', ')
    : '""';

  // 6. 是否草稿
  const draftInput = await ask(rl, '📝 是否设为草稿？(y/N)：');
  const isDraft = draftInput.toLowerCase() === 'y';

  rl.close();

  // ── 生成文件 ──

  const date = today();
  const fileName = isDraft
    ? `${date}-${slug}-draft.md`
    : `${date}-${slug}.md`;
  const filePath = path.join(POSTS_DIR, fileName);

  // 检查是否存在
  if (fs.existsSync(filePath)) {
    console.log(`\n⚠️  文件已存在: ${fileName}`);
    console.log('请更换标题或手动删除旧文件后重试。');
    process.exit(0);
  }

  // 读取模板并替换
  const templatePath = path.join(ROOT, 'templates', 'post.md');
  let template = fs.readFileSync(templatePath, 'utf-8');

  template = template.replace('{{title}}', title);
  template = template.replace('{{date}}', date);
  template = template.replace('{{description}}', description);
  template = template.replace('{{category}}', category || '');
  template = template.replace('{{tags}}', tags);

  // 写文件
  fs.writeFileSync(filePath, template, 'utf-8');

  console.log('');
  console.log('✅ 文章创建成功！');
  console.log(`📁 ${path.relative(ROOT, filePath)}`);
  console.log('');
  console.log('📋 文章信息：');
  console.log(`   标题: ${title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   日期: ${date}`);
  if (category) {
    const cat = categories.find((c) => c.slug === category);
    console.log(`   分类: ${cat?.icon ?? ''} ${cat?.name ?? category}`);
  }
  if (tagsInput) console.log(`   标签: ${tagsInput}`);
  if (isDraft) console.log(`   状态: 草稿（不会发布）`);
  console.log('');
  console.log('接下来：');
  console.log('  1. 打开生成的文件，填写正文内容');
  console.log('  2. 运行 npm run dev 本地预览');
  console.log('  3. git commit && git push 发布');
  console.log('');
}

main().catch((err) => {
  console.error('❌ 出错了:', err.message);
  process.exit(1);
});
