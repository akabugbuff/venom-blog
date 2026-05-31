# 写作指南

本指南介绍如何在"网络空间安全实验博客"中创建和管理文章。

## 一、新建文章

### 方式一：使用脚本（推荐）

在项目根目录运行：

```bash
npm run new:post
```

按照提示依次输入：

1. **文章标题** — 中文或英文均可
2. **英文 slug** — URL 标识，脚本会自动生成建议，可直接回车确认或手动输入
3. **文章描述** — 一句话摘要，用于列表展示
4. **选择分类** — 从已有分类中选择编号
5. **标签** — 多个用逗号分隔，如 `XSS, 防御方案, DVWA`
6. **是否草稿** — 输入 `y` 设为草稿（不发布），回车跳过

脚本会：
- 自动生成当前日期
- 在 `posts/` 目录下创建 `.md` 文件
- 使用实验报告模板填充 Frontmatter 和章节结构

### 方式二：手动创建

在 `posts/` 目录下新建 `.md` 文件，文件名格式：

```
YYYY-MM-DD-slug.md
```

例如：`2026-06-15-dvwa-sql-lab.md`

Frontmatter 格式：

```markdown
---
title: "文章标题"
date: "2026-06-15"
description: "简短描述"
category: web-security
tags: ["标签1", "标签2"]
draft: false
---

正文内容...
```

## 二、文章模板结构

每篇文章默认包含以下章节：

```
一、实验目的
二、实验环境
三、实验原理
四、实验步骤
五、实验结果
六、遇到的问题
七、实验总结
八、安全说明
```

你可以根据实际内容删减或调整章节。

## 三、分类说明

### 当前可用分类

| 图标 | 分类名 | slug | 说明 |
|------|--------|------|------|
| 🌐 | Web安全 | `web-security` | XSS、SQL注入、CSRF、SSRF 等 |
| 💻 | 二进制安全 | `binary-security` | 逆向工程、栈溢出、ROP 链构造 |
| 🔐 | 密码学 | `cryptography` | 加密算法、哈希函数、数字签名 |
| 🚩 | CTF竞赛 | `ctf` | Writeup、竞赛经验 |
| 🛠️ | 安全工具 | `tools` | Burp Suite、Wireshark、Metasploit 等 |

### 新增分类

运行：

```bash
npm run new:category
```

按提示输入分类信息，脚本会输出可复制的配置代码。将代码粘贴到 `src/lib/categories.ts` 的 `categories` 数组中即可。

保存后首页自动出现该分类卡片，新建文章时也可选择该分类。

## 四、标签使用建议

- 每篇文章建议 2-4 个标签
- 标签命名用简短关键词，如 `XSS`、`SQL注入`、`DVWA`
- 标签会自动出现在标签云中（按文章数量排序）
- 相同标签的文章可通过标签页统一浏览

## 五、草稿功能

如果文章还没写完，设置 `draft: true`：

- 本地开发时可以看到
- `npm run build` 构建时自动排除
- 推送后不会出现在线上博客

写完后再改为 `draft: false` 即可发布。

## 六、插入图片

1. 在 `public/` 目录下创建图片文件夹，如 `public/images/`
2. 在 Markdown 中引用：

```markdown
![图片描述](/images/sql-injection.png)
```

3. 如果图片较多，建议按文章建子目录：

```markdown
![拓扑图](/images/dvwa-lab/topology.png)
```

## 七、代码高亮

代码块使用三个反引号，指定语言即可自动高亮：

````markdown
```python
import requests
response = requests.get("http://target.com")
```
````

支持 200+ 语言，常用：

- `python`、`javascript`、`typescript`
- `bash`、`shell`、`powershell`
- `sql`、`html`、`css`、`json`、`yaml`
- `c`、`cpp`、`java`、`go`、`rust`

## 八、本地预览

```bash
npm run dev
```

浏览器访问 `http://localhost:5173/`，文章修改后自动热更新。

## 九、发布到 GitHub Pages

```bash
# 1. 添加修改
git add .

# 2. 提交
git commit -m "新增文章: DVWA SQL注入实验"

# 3. 推送
git push
```

推送后 GitHub Actions 自动构建部署，1-2 分钟后生效。

> 线上地址：https://akabugbuff.github.io/venom-blog/

## 十、标准写作流程

```bash
# 1. 创建文章
npm run new:post

# 2. 本地编辑
# 打开 posts/YYYY-MM-DD-slug.md
# 填写正文内容

# 3. 预览
npm run dev
# → http://localhost:5173/

# 4. 确认无误后发布
git add posts/
git commit -m "新文章: xxxxxx"
git push
```

---

> 💡 如有问题，请查看 [README.md](../README.md) 了解项目架构。
