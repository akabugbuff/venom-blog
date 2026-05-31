// ============================================================
// Supabase 数据库行类型 — 对应 init.sql 中的表结构
// ============================================================

/** profiles 表行 */
export interface ProfileRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

/** categories 表行 */
export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** tags 表行 */
export interface TagRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/** posts 表行 */
export interface PostRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category_id: string | null;
  cover_url: string;
  status: 'draft' | 'published';
  reading_time: number;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

/** post_tags 表行 */
export interface PostTagRow {
  post_id: string;
  tag_id: string;
}

/** media 表行 */
export interface MediaRow {
  id: string;
  filename: string;
  url: string;
  path: string;
  mime_type: string;
  size: number;
  created_at: string;
}

// ============================================================
// Supabase 嵌套查询结果类型（带关联数据）
// ============================================================

/** 带 category 的 post 查询结果 */
export interface PostWithCategory extends PostRow {
  categories: CategoryRow | null;
}

/** 带 tags 的 post 查询结果 */
export interface PostWithTags extends PostRow {
  post_tags: Array<{
    tag_id: string;
    tags: TagRow;
  }>;
}

/** 带 category 和 tags 的完整 post 查询结果 */
export interface PostFull extends PostWithCategory {
  post_tags: Array<{
    tag_id: string;
    tags: TagRow;
  }>;
}

/** 带 post_count 的 category 查询结果 */
export interface CategoryWithCount extends CategoryRow {
  post_count: number;
}
