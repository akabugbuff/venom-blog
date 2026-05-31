# 网络空间安全实验博客 (Venom Blog)

基于 **React + Vite + TypeScript + Supabase** 的 CMS 博客系统。前台公开访问，后台可视化管理文章/分类/标签/媒体，零服务器成本部署。

## 线上地址

| 入口 | 地址 |
|------|------|
| **前台博客** | `https://venom-blog.vercel.app/` |
| **后台管理** | `https://venom-blog.vercel.app/#/admin/login` |

> 如果换过 Vercel 项目，请以 Vercel Dashboard 中的实际域名为准。

---

## 技术架构

```
浏览器
  ├─ 前台博客 (/)        → React + Vite + Tailwind CSS
  └─ 后台管理 (/admin)   → React + Vite + Supabase Auth

数据层
  └─ Supabase
       ├─ Postgres   (文章/分类/标签)
       ├─ Auth       (管理员登录)
       └─ Storage    (封面图)
```

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | 类型安全的组件化开发 |
| 构建工具 | Vite 5 | HMR 开发 + Rollup 生产打包 |
| 路由 | React Router v6 (HashRouter) | `#/path` 模式，无 SPA 404 问题 |
| 样式 | Tailwind CSS 3 + Typography | prose 排版、暗色模式、蓝绿科技风 |
| 数据库 | Supabase Postgres | 文章/分类/标签持久化存储 |
| 认证 | Supabase Auth | 邮箱密码登录 |
| 存储 | Supabase Storage | 封面图上传 |
| 代码高亮 | Prism.js (rehype-prism-plus) | VS Code Dark 主题 |
| Markdown | react-markdown + remark-gfm | GFM 语法支持 |
| 部署 | Vercel | 推送即部署，免费托管 |

---

## 项目结构

```
blog/
├── posts/                      # 📝 Markdown 文章（fallback + 迁移源）
├── public/                     # 静态资源（favicon 等）
├── src/
│   ├── components/
│   │   ├── admin/              # AdminLayout, AdminRoute
│   │   ├── common/             # Container
│   │   ├── home/               # HeroSection, ProfileCard, TagCloud, RecentUpdates
│   │   ├── layout/             # Layout, Header, Footer
│   │   ├── markdown/           # CodeBlock, MarkdownRenderer
│   │   └── posts/              # PostCard, PostList, PostMeta, TagBadge
│   ├── hooks/                  # useAuth, usePosts, useTheme
│   ├── lib/
│   │   ├── api.ts              # 🔌 Supabase 数据访问层（含 Markdown fallback）
│   │   ├── categories.ts       # 📂 分类配置
│   │   ├── markdown.tsx        # Markdown 渲染引擎
│   │   ├── posts.ts            # Markdown 文章加载（import.meta.glob）
│   │   ├── supabase.ts         # Supabase 客户端
│   │   └── supabase-types.ts   # 数据库行类型
│   ├── pages/
│   │   ├── admin/              # LoginPage, DashboardPage, PostListPage,
│   │   │                          PostEditorPage, CategoryListPage,
│   │   │                          TagListPage, MediaPage
│   │   ├── HomePage.tsx        # 首页（Hero + 分类 + 最新文章）
│   │   ├── BlogPage.tsx        # 全部文章
│   │   ├── PostPage.tsx        # 文章详情
│   │   ├── CategoryPage.tsx    # 分类文章
│   │   ├── ArchivePage.tsx     # 归档
│   │   ├── TagsPage.tsx        # 标签云
│   │   ├── TagPage.tsx         # 标签文章
│   │   ├── AboutPage.tsx       # 关于
│   │   └── NotFoundPage.tsx    # 404
│   ├── routes/AppRouter.tsx    # 路由配置
│   ├── styles/globals.css      # 全局样式 + Prism 主题
│   └── types/post.ts           # TypeScript 类型
├── supabase/init.sql           # 🗄️ Supabase 数据库初始化 SQL
├── scripts/
│   ├── migrate-posts.mjs       # Markdown → Supabase 迁移脚本
│   ├── new-post.mjs            # 命令行新建文章（备用）
│   └── new-category.mjs        # 命令行新增分类（备用）
├── templates/post.md           # 文章模板
├── docs/writing-guide.md       # 写作指南
├── .env.example                # 环境变量模板
├── vercel.json                 # Vercel SPA 路由配置
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 快速开始（本地开发）

### 前置条件

- Node.js 18+
- 一个 Supabase 项目
- 一个管理员账号（在 Supabase Auth 中创建）

### 1. 克隆 + 安装

```bash
git clone https://github.com/akabugbuff/venom-blog.git
cd venom-blog
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Supabase 信息：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
```

> **重要**：`.env` 已加入 `.gitignore`，不会被提交。`VITE_` 前缀的变量会自动注入到前端代码。

### 3. 启动

```bash
npm run dev
```

打开 `http://localhost:5173/` 查看前台，`http://localhost:5173/#/admin/login` 进入后台。

### 4. 构建

```bash
npm run build     # TypeScript 检查 + Vite 打包
npm run preview   # 预览构建产物
```

---

## 🗄️ Supabase 初始化（首次部署必做）

如果是从零开始部署，或换了新的 Supabase 项目，需要执行以下步骤：

### 1. 创建 Supabase 项目

在 [supabase.com](https://supabase.com) 注册并创建项目，记下 `Project URL` 和 `anon public key`。

### 2. 执行数据库初始化

打开 Supabase Dashboard → SQL Editor，复制 [supabase/init.sql](supabase/init.sql) 全部内容并执行。

这会自动创建：
- `profiles` 表（用户角色）
- `categories` 表（含 7 个默认分类）
- `tags` 表
- `posts` 表
- `post_tags` 表
- `media` 表
- RLS 安全策略
- 新用户注册触发器

### 3. 创建 Storage Bucket

Supabase Dashboard → Storage → New Bucket：
- Name: `covers`
- 勾选 **Public bucket**

然后在 Storage → Policies 中为 `covers` bucket 添加策略（详见 init.sql 底部注释）。

### 4. 创建管理员账号

1. Authentication → Users → Add User，填写邮箱和密码
2. 复制该用户的 `id`（UUID）
3. SQL Editor 执行：

```sql
UPDATE profiles SET role = 'admin' WHERE id = '粘贴用户id';
```

### 5. 导入现有 Markdown 文章（可选）

```bash
npm run migrate
```

输入管理员邮箱和密码，脚本会自动将 `posts/` 目录下的 `.md` 文章导入 Supabase。

---

## 📝 日常写作流程

### 方式一：后台可视化管理（推荐）

1. 访问 `/#/admin/login`，用管理员账号登录
2. 点击「文章管理」→「新建文章」
3. 填写标题、slug、摘要，选择分类和标签
4. 正文使用 Markdown 编写，textarea 中直接写
5. 选择「发布」状态，点保存
6. 刷新前台 → 新文章立即可见

### 方式二：命令行创建（备用）

```bash
npm run new:post
```

按提示输入信息，会在 `posts/` 目录生成 `.md` 文件。然后运行 `npm run migrate` 同步到 Supabase。

### 文章编辑

在后台文章列表中点击「编辑」，修改后保存即可。状态可随时在「草稿」和「发布」之间切换。

---

## 📂 分类管理

### 新增分类

1. 后台 → 分类管理 → 新建分类
2. 填写名称、slug、图标（emoji）、描述
3. 保存后首页自动出现该分类卡片

### 默认分类

| 图标 | 名称 | slug |
|------|------|------|
| 🌐 | Web安全 | `web-security` |
| 💻 | 二进制安全 | `binary-security` |
| 🔐 | 密码学 | `cryptography` |
| 🚩 | CTF竞赛 | `ctf` |
| 🛠️ | 安全工具 | `tools` |
| 🎯 | 渗透测试 | `penetration-test` |
| 🔄 | 容灾实验 | `disaster-recovery` |

---

## 🖼️ 封面图

1. 后台 → 媒体管理 → 上传图片（最大 5MB）
2. 点击「复制 URL」
3. 编辑文章时粘贴到「封面图 URL」字段

或在文章编辑页直接点封面图字段旁的「上传」按钮。

---

## 🚢 部署（Vercel）

### 首次部署

1. 把代码推送到 GitHub
2. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录
3. Import 仓库 `akabugbuff/venom-blog`
4. 配置环境变量（同 `.env`）
5. 点 Deploy

### 环境变量

在 Vercel Dashboard → Settings → Environment Variables 中设置：

```
VITE_SUPABASE_URL    = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_xxxxxxxxxxxx
```

### 后续更新

```bash
git add .
git commit -m "描述改动"
git push
```

Vercel 自动检测推送并重新部署。

### 更换域名

Vercel Dashboard → Settings → Domains 可以绑定自定义域名。

---

## 🔐 安全设计

| 层 | 机制 | 说明 |
|----|------|------|
| 路由守卫 | `AdminRoute` 组件 | 未登录 → 跳转登录页；非 admin → 拒绝访问 |
| RLS 策略 | Supabase 数据库级别 | 写入操作强制检查 `profiles.role = 'admin'` |
| 公开读取 | RLS SELECT 策略 | 前台只能读 `status = 'published'` 的文章 |
| anon key | 前端仅持有 anon key | 不含 service_role 权限，无法绕过 RLS |

---

## 🔄 数据容灾

项目采用 **Supabase 优先 + Markdown fallback** 的双层数据策略：

- Supabase 正常时，前台从数据库读取数据
- Supabase 不可用时，自动回退到 `posts/` 目录下的 `.md` 文件
- 两者都不会丢失数据

如果 Supabase 长期不可用，可以通过 `npm run migrate` 将 Markdown 文章重新导入。

---

## 🌗 暗色模式

- 点击导航栏右侧的太阳/月亮图标切换
- 偏好保存在浏览器 localStorage 中
- 自动跟随系统配色方案（首次访问时）

---

## 📋 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建产物
npm run lint         # TypeScript 类型检查
npm run new:post     # 命令行创建文章（备用）
npm run new:category # 命令行创建分类（备用）
npm run migrate      # Markdown → Supabase 迁移
```

---

## 🔧 常见问题

### Q: 前台页面空白或没有文章数据？

检查 `.env` 中 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确。如果 Supabase 暂时不可用，系统会自动回退到 `posts/` 目录下的 Markdown 文章，确保不会完全空白。

### Q: 后台登录后提示"无权限访问"？

需要在 Supabase SQL Editor 中执行：
```sql
UPDATE profiles SET role = 'admin' WHERE id = '你的用户id';
```

### Q: 上传图片失败？

检查 Supabase Storage 中 `covers` bucket 是否存在且为 Public。确认 Storage Policies 已添加（SELECT/INSERT/DELETE）。

### Q: Vercel 部署后页面 404？

确认项目根目录有 `vercel.json` 文件，内容为 SPA fallback 配置。

### Q: HashRouter 的 `#` 在 URL 里不好看？

这是 HashRouter 的特点，确保 GitHub Pages / Vercel 等静态托管平台无 SPA 刷新 404 问题。如果介意 `#`，可以改为 BrowserRouter，但需要服务端配置 URL 重写规则。

---

## 📄 License

MIT
