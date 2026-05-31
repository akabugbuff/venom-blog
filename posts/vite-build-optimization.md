---
title: "SQL 注入攻击与防御实战"
date: "2026-05-28"
description: "从 SQL 注入原理到实战绕过技巧，再到参数化查询防御，全面掌握 SQL 注入攻防。"
category: web-security
tags: ["web安全", "SQL注入", "数据库"]
draft: false
---

## SQL 注入概述

SQL 注入（SQL Injection）是最古老、最危险的 Web 安全漏洞之一。攻击者通过构造恶意的 SQL 语句，欺骗数据库执行非预期的查询，从而读取、修改甚至删除数据库中的数据。

## 漏洞原理

### 经典的登录绕过

```python
# 存在漏洞的代码
username = request.form['username']
password = request.form['password']

query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
cursor.execute(query)
```

当用户输入以下内容时：

```
username: admin' --
password: anything
```

实际执行的 SQL 变为：

```sql
SELECT * FROM users WHERE username='admin' --' AND password='anything'
```

`--` 注释掉了后面的密码验证部分，攻击者无需密码即可以 admin 身份登录。

### UNION 注入

```sql
-- 正常查询
SELECT id, name FROM products WHERE category = 'books';

-- 注入后的查询
SELECT id, name FROM products WHERE category = '' UNION SELECT username, password FROM users --';
```

### 盲注（Blind SQL Injection）

当页面不直接显示查询结果时，通过布尔逻辑或时间延迟来判断：

```sql
-- 布尔盲注：判断数据库用户名的第一个字符是否为 'r'
SELECT * FROM users WHERE id = 1 AND SUBSTRING((SELECT user()), 1, 1) = 'r';

-- 时间盲注：如果条件为真则延迟 5 秒
SELECT * FROM users WHERE id = 1 AND IF(
    SUBSTRING((SELECT user()), 1, 1) = 'r',
    SLEEP(5),
    0
);
```

## 防御方案

### 参数化查询（首选方案）

```python
# 安全的做法：使用参数化查询
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)
```

```java
// Java PreparedStatement
String query = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement stmt = connection.prepareStatement(query);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();
```

### ORM 框架

```python
# Django ORM 自动参数化
user = User.objects.filter(username=username, password=password).first()

# SQLAlchemy
user = session.query(User).filter(
    User.username == username,
    User.password == password
).first()
```

### 最小权限原则

```sql
-- 应用账号只授予必要权限
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON blog.* TO 'webapp'@'localhost';
-- 不授予 DROP、ALTER、DELETE 等危险权限
```

## 实战环境搭建

```bash
# 使用 Docker 搭建 SQLi 练习环境
docker run -d --name sqli-lab \
  -p 8080:80 \
  acgpiano/sqli-labs:latest
```

## WAF 绕过技巧（仅供学习）

现代 WAF（Web Application Firewall）可以拦截常见的 SQL 注入攻击，但存在多种绕过方法：

```sql
-- 注释变形绕过
SELECT/**/password/**/FROM/**/users

-- 大小写绕过
SeLeCt password FrOm users

-- 双写绕过（WAF 只替换一次关键字）
SELSELECTECT password FRFROMOM users
```

> **免责声明**：以上技术仅用于安全学习和授权测试，请勿用于非法活动。

## 总结

| 防御措施 | 效果 | 推荐度 |
|----------|------|--------|
| 参数化查询 | 从根本上杜绝注入 | ⭐⭐⭐⭐⭐ |
| 输入验证 | 作为辅助防御层 | ⭐⭐⭐⭐ |
| 最小权限 | 降低攻击影响 | ⭐⭐⭐⭐ |
| WAF | 可被绕过，不可依赖 | ⭐⭐⭐ |

**核心原则**：永远不要拼接用户输入到 SQL 语句中，始终使用参数化查询。
