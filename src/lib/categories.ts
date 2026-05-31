/**
 * === 博客分类配置 ===
 *
 * 在这里定义你的博客分类。新增一个分类只需在下方数组中添加一项，
 * 首页会自动出现该分类的入口卡片。
 *
 * 然后在文章 frontmatter 中设置 category 字段对应 slug 即可归入该分类。
 */

export interface Category {
  slug: string;       // URL 标识，如 "web-security"
  name: string;       // 显示名称，如 "Web安全"
  icon: string;       // 图标（emoji），如 "🌐"
  description: string; // 简短描述
}

export const categories: Category[] = [
  {
    slug: 'web-security',
    name: 'Web安全',
    icon: '🌐',
    description: 'XSS、SQL注入、CSRF、SSRF 等 Web 漏洞分析与防御',
  },
  {
    slug: 'binary-security',
    name: '二进制安全',
    icon: '💻',
    description: '逆向工程、栈溢出、格式化字符串、ROP 链构造',
  },
  {
    slug: 'cryptography',
    name: '密码学',
    icon: '🔐',
    description: '对称/非对称加密、哈希函数、数字签名与证书',
  },
  {
    slug: 'ctf',
    name: 'CTF竞赛',
    icon: '🚩',
    description: '解题 Writeup、竞赛经验与技巧总结',
  },
  {
    slug: 'tools',
    name: '安全工具',
    icon: '🛠️',
    description: 'Burp Suite、Wireshark、Metasploit 等工具教程',
  },
];

/**
 * 根据 slug 查找分类
 */
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
