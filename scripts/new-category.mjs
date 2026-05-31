/**
 * new-category.mjs — 新增分类辅助脚本
 *
 * 用法:
 *   npm run new:category
 *
 * 运行后按提示输入分类信息，输出可复制的配置代码。
 * 不会自动修改 categories.ts，需要手动复制粘贴到文件中。
 */

import * as readline from 'node:readline';

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║     📂  新增博客分类                ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const name = await ask(rl, '📂 分类名称（如：系统安全）：');
  if (!name) {
    console.log('❌ 分类名称不能为空。');
    rl.close();
    return;
  }

  const slug = await ask(rl, '🔗 分类 slug（如：system-security）：');
  if (!slug) {
    console.log('❌ slug 不能为空。');
    rl.close();
    return;
  }

  const icon = await ask(rl, '🎨 图标 emoji（如 🖥️）：');
  const description = await ask(rl, '📄 分类描述（一句话）：');

  rl.close();

  // ── 输出配置代码 ──
  console.log('');
  console.log('✅ 分类配置已生成！');
  console.log('');
  console.log('📋 请将以下代码复制到 src/lib/categories.ts 的 categories 数组中：');
  console.log('');
  console.log('─'.repeat(60));
  console.log('');
  console.log(`  {`);
  console.log(`    slug: '${slug}',`);
  console.log(`    name: '${name}',`);
  console.log(`    icon: '${icon || '📂'}',`);
  console.log(`    description: '${description || name}',`);
  console.log(`  },`);
  console.log('');
  console.log('─'.repeat(60));
  console.log('');
  console.log('📝 操作步骤：');
  console.log('  1. 打开 src/lib/categories.ts');
  console.log('  2. 在 categories 数组末尾粘贴上面的代码');
  console.log('  3. 保存文件');
  console.log('  4. 运行 npm run dev 检查首页分类卡片是否出现');
  console.log('');
  console.log('💡 之后就可以在新建文章时选择这个分类了。');
  console.log('');
}

main().catch((err) => {
  console.error('❌ 出错了:', err.message);
  process.exit(1);
});
