# 网络空间安全实验博客 (Venom Blog)

基于 **React + Vite + TypeScript** 构建的静态博客，Markdown 驱动，Prism.js 代码高亮，部署于 GitHub Pages。

## 🚀 技术架构

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | React 18 + TypeScript | 类型安全，组件化开发 |
| **构建工具** | Vite 5 | 极速 HMR 开发体验，Rollup 生产打包 |
| **路由** | React Router v6 (HashRouter) | Hash 路由，GitHub Pages 无 404 问题 |
| **内容格式** | Markdown (`.md`) + YAML Frontmatter | 文章源格式，手写解析器解析元数据 |
| **Markdown 渲染** | `react-markdown` + `remark-gfm` | GitHub Flavored Markdown 支持 |
| **代码高亮** | Prism.js (`rehype-prism-plus`) | VS Code 风格暗色主题，同步渲染 |
| **样式方案** | Tailwind CSS 3 + `@tailwindcss/typography` | 实用优先，prose 排版，暗色模式 |
| **文章加载** | `import.meta.glob` (Vite) | 构建时静态加载全部 `.md` 文件 |
| **部署** | GitHub Actions → GitHub Pages | 推送即部署，零服务器成本 |

## 📁 项目结构

```
blog/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动部署
├── posts/                      # 📝 文章目录（.md 文件即文章）
│   ├── hello-world.md
│   ├── typescript-union-types.md
│   └── vite-build-optimization.md
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/             # 通用组件（Container）
│   │   ├── layout/             # 布局组件（Layout, Header, Footer）
│   │   ├── markdown/           # Markdown 渲染组件
│   │   └── posts/              # 文章相关组件（PostCard, PostList, PostMeta, TagBadge）
│   ├── hooks/                  # 自定义 Hooks（usePosts, useTheme）
│   ├── lib/                    # 核心逻辑
│   │   ├── categories.ts       # 📂 分类配置（手动管理分类）
│   │   ├── markdown.tsx        # Markdown 渲染配置
│   │   └── posts.ts            # 文章加载与解析（import.meta.glob）
│   ├── pages/                  # 页面组件
│   │   ├── HomePage.tsx        # 首页（分类导航 + 最新文章）
│   │   ├── BlogPage.tsx        # 全部文章列表
│   │   ├── PostPage.tsx        # 文章详情页
│   │   ├── CategoryPage.tsx    # 分类文章列表
│   │   ├── ArchivePage.tsx     # 归档页（按年份分组）
│   │   ├── TagsPage.tsx        # 标签云
│   │   ├── TagPage.tsx         # 标签筛选结果
│   │   ├── AboutPage.tsx       # 关于页面
│   │   └── NotFoundPage.tsx    # 404 页面
│   ├── routes/
│   │   └── AppRouter.tsx       # 路由配置
│   ├── styles/
│   │   └── globals.css         # 全局样式 + Prism 主题
│   ├── types/
│   │   ├── post.ts             # TypeScript 类型定义
│   │   └── vite-env.d.ts       # Vite 类型声明
│   ├── App.tsx                 # 应用入口
│   └── main.tsx                # React 挂载点
├── index.html
├── package.json
├── vite.config.ts              # Vite 配置（含路径别名、分包策略）
├── tailwind.config.ts          # Tailwind 配置（暗色模式、typography 插件）
├── tsconfig.json
└── README.md
```

## 🗺️ 路由设计

| 路径 | 页面 | 说明 |
|------|------|------|
| `/#/` | 首页 | 分类导航卡片 + 最新文章 |
| `/#/blog` | 全部文章 | 按时间倒序排列 |
| `/#/blog/:slug` | 文章详情 | Markdown 渲染 + 代码高亮 |
| `/#/category/:slug` | 分类列表 | 某分类下的所有文章 |
| `/#/archive` | 归档 | 按年份分组的时间线 |
| `/#/tags` | 标签云 | 所有标签及文章计数 |
| `/#/tags/:tag` | 标签筛选 | 带某标签的文章列表 |
| `/#/about` | 关于 | 静态介绍页 |
| `/*` | 404 | 页面未找到 |

## 📝 文章格式

在 `posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-06-15"
description: "文章摘要，用于列表和 SEO"
category: web-security       # 对应 categories.ts 中的 slug
tags: ["XSS", "防御方案"]     # 可选标签
draft: false                 # true = 草稿，不会发布
updated: "2026-06-20"        # 可选，更新日期
---

正文内容（支持 GitHub Flavored Markdown）...

## 二级标题

代码块自动高亮：

\`\`\`python
def hello():
    print("Hello World")
\`\`\`
```

### Frontmatter 字段说明

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `title` | ✅ | string | 文章标题 |
| `date` | ✅ | string | 发布日期（ISO 8601） |
| `description` | ✅ | string | 简短描述，用于卡片和 SEO |
| `category` | 推荐 | string | 归属分类 slug，对应 `categories.ts` |
| `tags` | 可选 | string[] | 标签列表 |
| `draft` | 可选 | boolean | 设为 `true` 则构建时忽略 |
| `updated` | 可选 | string | 最后更新日期 |

## 📂 分类管理

分类在 `src/lib/categories.ts` 中手动定义，而非从文章自动生成。

### 添加新分类

编辑 [src/lib/categories.ts](src/lib/categories.ts)，在数组中添加一项：

```ts
{
  slug: 'system-security',      // URL 标识（英文，短横线分隔）
  name: '系统安全',              // 显示名称（中文）
  icon: '🖥️',                   // Emoji 图标
  description: 'Windows/Linux 系统安全加固与渗透测试',
}
```

保存后：
- 🏠 **首页**自动出现该分类的导航卡片
- 📂 访问 `/#/category/system-security` 查看该分类文章
- ✍️ 写文章时设置 `category: system-security` 即可归入该分类

### 默认分类

| 图标 | 名称 | Slug | 说明 |
|------|------|------|------|
| 🌐 | Web安全 | `web-security` | XSS、SQL注入、CSRF 等 |
| 💻 | 二进制安全 | `binary-security` | 逆向工程、栈溢出、ROP |
| 🔐 | 密码学 | `cryptography` | 加解密算法、数字签名 |
| 🚩 | CTF竞赛 | `ctf` | 竞赛 Writeup 与经验 |
| 🛠️ | 安全工具 | `tools` | Burp Suite、Metasploit 等 |

## 🎨 特性

- 🌗 **暗色模式** — 自动跟随系统 / 手动切换，localStorage 持久化
- 💡 **代码高亮** — Prism.js VS Code Dark 主题，支持 200+ 语言
- 📱 **响应式设计** — 移动端 / 平板 / 桌面端自适应
- ⚡ **零运行时请求** — 所有文章构建时打包，无 API 调用
- 🏷️ **双重分类体系** — 分类（主分类）+ 标签（辅助标注）
- 📅 **归档时间线** — 按年份浏览全部文章
- #️⃣ **Hash 路由** — GitHub Pages 无 404，SPA 完美运行

## 🔧 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/akabugbuff/venom-blog.git
cd venom-blog

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# → http://localhost:5173/

# 4. 构建生产版本
npm run build

# 5. 预览构建产物
npm run preview
```

## 🚢 部署

### 自动部署（推荐）

推送代码到 GitHub `main` 分支，GitHub Actions 自动构建部署：

```bash
git add .
git commit -m "更新博客"
git push
```

约 1-2 分钟后访问：**https://akabugbuff.github.io/venom-blog/**

### 配置说明

- **仓库名**：`venom-blog`
- **VITE_BASE**：`/venom-blog/`（在 `.github/workflows/deploy.yml` 中配置）
- **Pages 设置**：Settings → Pages → Source 选择 "GitHub Actions"

如仓库名不同，修改 `deploy.yml` 中的 `VITE_BASE` 环境变量即可。

## 📊 构建产物

```
dist/
├── index.html                        (~0.8 KB)
├── assets/
│   ├── index-xxxxx.css               (~55 KB / gzip 6.8 KB)
│   ├── index-xxxxx.js                (~22 KB / gzip 9.8 KB)
│   ├── react-vendor-xxxxx.js         (~163 KB / gzip 53 KB)
│   └── markdown-vendor-xxxxx.js      (~764 KB / gzip 267 KB)
```

- React 核心库独立分包，利用浏览器缓存
- Markdown 渲染库（含 Prism 语言包）独立分包

## 📄 License

MIT
