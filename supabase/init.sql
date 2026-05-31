-- ============================================================
-- 网络空间安全实验博客 — Supabase 初始化 SQL
-- 使用方式: 复制全部内容到 Supabase SQL Editor 中执行
-- ============================================================

-- ────────────────────────────────────────
-- 1. 更新 updated_at 的自动触发器函数
-- ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────
-- 2. profiles 表（用户资料 + 角色）
-- ────────────────────────────────────────
CREATE TABLE profiles (
  id         UUID REFERENCES auth.users PRIMARY KEY,
  username   TEXT,
  avatar_url TEXT,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles: 每个人可以读自己的；登录用户可以读其他公开资料
CREATE POLICY "Profiles viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Profiles insert by owner"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles update by owner"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ────────────────────────────────────────
-- 3. 新用户注册时自动创建 profile
-- ────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 如果触发器已存在则先删除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────
-- 4. categories 表
-- ────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT '📂',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 所有人可读
CREATE POLICY "Categories viewable by everyone"
  ON categories FOR SELECT USING (true);

-- 仅 admin 可增删改
CREATE POLICY "Categories insert by admin"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Categories update by admin"
  ON categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Categories delete by admin"
  ON categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- updated_at 自动更新
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────
-- 5. tags 表
-- ────────────────────────────────────────
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags viewable by everyone"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Tags insert by admin"
  ON tags FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Tags update by admin"
  ON tags FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Tags delete by admin"
  ON tags FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────
-- 6. posts 表
-- ────────────────────────────────────────
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT DEFAULT '',
  content       TEXT DEFAULT '',
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  cover_url     TEXT DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time  INT DEFAULT 1,
  published_at  TIMESTAMPTZ,
  author_id     UUID REFERENCES auth.users DEFAULT auth.uid(),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 公开只读 published
CREATE POLICY "Published posts viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

-- admin 可读取所有（包括 draft）
CREATE POLICY "All posts viewable by admin"
  ON posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- admin 可增删改
CREATE POLICY "Posts insert by admin"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Posts update by admin"
  ON posts FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Posts delete by admin"
  ON posts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────
-- 7. post_tags 表（多对多）
-- ────────────────────────────────────────
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post_tags viewable by everyone"
  ON post_tags FOR SELECT USING (true);

CREATE POLICY "Post_tags insert by admin"
  ON post_tags FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Post_tags delete by admin"
  ON post_tags FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────
-- 8. media 表
-- ────────────────────────────────────────
CREATE TABLE media (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename   TEXT NOT NULL,
  url        TEXT NOT NULL,
  path       TEXT NOT NULL,
  mime_type  TEXT DEFAULT '',
  size       BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media viewable by everyone"
  ON media FOR SELECT USING (true);

CREATE POLICY "Media insert by admin"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Media delete by admin"
  ON media FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────
-- 9. 插入默认分类
-- ────────────────────────────────────────
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Web安全',    'web-security',    'XSS、SQL注入、CSRF、SSRF 等 Web 漏洞分析与防御',        '🌐', 1),
  ('二进制安全', 'binary-security', '逆向工程、栈溢出、格式化字符串、ROP 链构造',              '💻', 2),
  ('密码学',     'cryptography',    '对称/非对称加密、哈希函数、数字签名与证书',               '🔐', 3),
  ('CTF竞赛',    'ctf',             '解题 Writeup、竞赛经验与技巧总结',                        '🚩', 4),
  ('安全工具',   'tools',           'Burp Suite、Wireshark、Metasploit 等工具教程',           '🛠️', 5),
  ('渗透测试',   'penetration-test', '信息收集、漏洞扫描、漏洞利用、后渗透与权限维持',          '🎯', 6),
  ('容灾实验',   'disaster-recovery', '数据备份、系统恢复、高可用架构与灾备演练',               '🔄', 7);

-- ============================================================
-- ⚠️ 以下步骤需要在 Supabase Dashboard 中手动操作：
-- ============================================================
--
-- 1. Storage → 新建 bucket: "covers"
--    - 勾选 "Public bucket"
--    - 文件大小限制: 5MB
--
-- 2. 在 Storage → Policies 中为 covers bucket 添加:
--    ① SELECT: 公开读取
--       Policy name: "Covers viewable by everyone"
--       Allowed operation: SELECT
--       USING expression: (bucket_id = 'covers')
--
--    ② INSERT: 仅 admin
--       Policy name: "Covers upload by admin"
--       Allowed operation: INSERT
--       USING expression: (
--         bucket_id = 'covers'
--         AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--       )
--
--    ③ DELETE: 仅 admin
--       Policy name: "Covers delete by admin"
--       Allowed operation: DELETE
--       USING expression: (
--         bucket_id = 'covers'
--         AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
--       )
--
-- 3. 创建第一个管理员:
--    ① 在 Authentication → Users → Add user 创建你的账号
--    ② 然后在 SQL Editor 执行:
--       UPDATE profiles SET role = 'admin' WHERE id = '<你的user_id>';
--       （user_id 可在 Authentication → Users 中找到）
-- ============================================================
