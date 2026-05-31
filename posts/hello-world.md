---
title: "Hello World — 网络空间安全实验博客开篇"
date: "2026-05-01"
description: "网络空间安全实验博客的第一篇文章，介绍博客的搭建过程和内容规划。"
category: tools
tags: ["blog", "meta"]
---

## 关于本博客

这是**网络空间安全实验博客**（Venom Blog）的第一篇文章。本博客旨在记录网络空间安全学习过程中的实验笔记、漏洞分析和技术总结。

## 技术栈

经过调研，选择了以下技术方案搭建博客：

- **React 18** + **TypeScript** — 类型安全的前端框架
- **Vite 5** — 极速的构建工具
- **Tailwind CSS** — 实用优先的 CSS 框架
- **Shiki** — 基于 TextMate 语法的代码高亮（VS Code 同款引擎）
- **GitHub Pages** — 零成本部署

## Shiki 代码高亮演示

作为安全博客，代码高亮至关重要。Shiki 提供了与 VS Code 一致的高亮体验：

```python
# 一个简单的端口扫描脚本示例
import socket
import sys

def scan_port(host: str, port: int) -> bool:
    """扫描目标主机的指定端口是否开放"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except socket.error:
        return False

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
    ports = [21, 22, 80, 443, 3306, 8080]

    print(f"[*] Scanning {target}...")
    for port in ports:
        if scan_port(target, port):
            print(f"[+] Port {port} is OPEN")
        else:
            print(f"[-] Port {port} is closed")

if __name__ == "__main__":
    main()
```

## 后续计划

本博客将涵盖以下安全领域的内容：

1. **Web 安全** — XSS、SQL 注入、CSRF、SSRF 等漏洞分析与防御
2. **二进制安全** — 逆向工程、栈溢出、格式化字符串漏洞
3. **密码学** — 对称加密、非对称加密、哈希算法、数字签名
4. **CTF 竞赛** — 解题思路、Writeup 和经验总结
5. **安全工具** — Burp Suite、Wireshark、Metasploit 等工具教程

欢迎持续关注！
