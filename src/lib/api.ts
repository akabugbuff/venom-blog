/**
 * api.ts — 统一数据访问层
 *
 * 优先从 Supabase 读取数据，失败或无数据时 fallback 到 Markdown。
 * 阶段 1: 只实现读取函数，不影响现有前台。
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type {
  PostRow,
  CategoryRow,
  TagRow,
  PostFull,
  CategoryWithCount,
} from './supabase-types';
import type { Post, PostMeta, TagCount } from '../types/post';
import {
  getAllPostMeta as getMarkdownPostMeta,
  getPostBySlug as getMarkdownPostBySlug,
  getPostsByCategory as getMarkdownPostsByCategory,
  getPostsByTag as getMarkdownPostsByTag,
  getAllTags as getMarkdownTags,
} from './posts';

// ── 工具函数 ──

function computeReadingTime(text: string): number {
  const wpm = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
}

/** 判断 Supabase 是否有数据 */
function hasData<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/** 判断错误是否需 fallback */
function shouldFallback(error: unknown): boolean {
  if (!error) return false;
  const msg = typeof error === 'string' ? error : (error as Error).message;
  // 未配置 Supabase 时不报错，静默 fallback
  if (msg.includes('placeholder.supabase.co')) return true;
  return true;
}

// ── 类型转换函数 ──

/**
 * 将 Supabase PostRow 转换为前台用的 PostMeta
 */
export function transformRowToPostMeta(
  row: PostRow,
  category?: CategoryRow | null,
  tags?: TagRow[]
): PostMeta {
  const date = row.published_at ?? row.created_at;
  return {
    slug: row.slug,
    frontmatter: {
      title: row.title,
      date: date.slice(0, 10),
      description: row.description,
      category: category?.slug,
      tags: tags?.map((t) => t.name) ?? [],
    },
    readingTime: row.reading_time || computeReadingTime(row.content),
  };
}

/**
 * 将 Supabase PostRow 转换为带正文的 Post
 */
export function transformRowToPost(
  row: PostRow,
  category?: CategoryRow | null,
  tags?: TagRow[]
): Post {
  const date = row.published_at ?? row.created_at;
  return {
    slug: row.slug,
    frontmatter: {
      title: row.title,
      date: date.slice(0, 10),
      description: row.description,
      category: category?.slug,
      tags: tags?.map((t) => t.name) ?? [],
    },
    content: row.content,
    readingTime: row.reading_time || computeReadingTime(row.content),
  };
}

// ═══════════════════════════════════════════════
// 后台 Admin CRUD（阶段 3: 无 fallback，直接操作 Supabase）
// ═══════════════════════════════════════════════

/** 获取所有文章（含草稿，仅 admin 可调用） */
export async function getAllPostsAdmin(): Promise<PostRow[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tag_id, tags(*))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PostRow[]) ?? [];
}

/** 管理员获取单篇文章（含草稿） */
export async function getPostByIdAdmin(id: string): Promise<PostFull | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories(*), post_tags(tag_id, tags(*))')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as PostFull;
}

/** 创建文章 */
export async function createPost(input: {
  title: string;
  slug: string;
  description: string;
  content: string;
  category_id: string | null;
  cover_url: string;
  status: 'draft' | 'published';
  tag_ids: string[];
}): Promise<PostRow> {
  const publishedAt =
    input.status === 'published' ? new Date().toISOString() : null;
  const readingTime = computeReadingTime(input.content);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      content: input.content,
      category_id: input.category_id,
      cover_url: input.cover_url,
      status: input.status,
      reading_time: readingTime,
      published_at: publishedAt,
    })
    .select()
    .single();

  if (error) throw error;

  // 插入 post_tags 关联
  if (input.tag_ids.length > 0) {
    const postTags = input.tag_ids.map((tag_id) => ({
      post_id: data.id,
      tag_id,
    }));
    await supabase.from('post_tags').insert(postTags);
  }

  return data;
}

/** 更新文章 */
export async function updatePost(
  id: string,
  input: {
    title: string;
    slug: string;
    description: string;
    content: string;
    category_id: string | null;
    cover_url: string;
    status: 'draft' | 'published';
    tag_ids: string[];
  }
): Promise<void> {
  const publishedAt =
    input.status === 'published' ? new Date().toISOString() : null;
  const readingTime = computeReadingTime(input.content);

  const { error } = await supabase
    .from('posts')
    .update({
      title: input.title,
      slug: input.slug,
      description: input.description,
      content: input.content,
      category_id: input.category_id,
      cover_url: input.cover_url,
      status: input.status,
      reading_time: readingTime,
      published_at: publishedAt,
    })
    .eq('id', id);

  if (error) throw error;

  // 重建 post_tags
  await supabase.from('post_tags').delete().eq('post_id', id);
  if (input.tag_ids.length > 0) {
    const postTags = input.tag_ids.map((tag_id) => ({
      post_id: id,
      tag_id,
    }));
    await supabase.from('post_tags').insert(postTags);
  }
}

/** 删除文章 */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

/** 获取仪表盘统计数据 */
export async function getDashboardStats(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categoryCount: number;
  tagCount: number;
}> {
  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: draftPosts },
    { count: categoryCount },
    { count: tagCount },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),
    supabase
      .from('categories')
      .select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalPosts: totalPosts ?? 0,
    publishedPosts: publishedPosts ?? 0,
    draftPosts: draftPosts ?? 0,
    categoryCount: categoryCount ?? 0,
    tagCount: tagCount ?? 0,
  };
}

/** 获取所有标签（简单列表，给表单选择用） */
export async function getAllTagsSimple(): Promise<TagRow[]> {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  return data ?? [];
}

// ── 分类 CRUD ──

export async function createCategory(input: {
  name: string;
  slug: string;
  description: string;
  icon: string;
}): Promise<CategoryRow> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; description: string; icon: string }
): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update(input)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ── 标签 CRUD ──

export async function createTag(input: { name: string; slug: string }): Promise<TagRow> {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name: input.name, slug: input.slug })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTag(id: string, input: { name: string; slug: string }): Promise<void> {
  const { error } = await supabase.from('tags').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════
// 前台公开 API（阶段 1: 优先 Supabase，fallback Markdown）
// ═══════════════════════════════════════════════

/** 获取所有已发布文章列表 */
export async function getPublishedPostMeta(): Promise<PostMeta[]> {
  if (!isSupabaseConfigured()) return getMarkdownPostMeta();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*), post_tags(tag_id, tags(*))')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!hasData(data)) return getMarkdownPostMeta();

    const posts = (data as unknown as PostFull[]).map((row) => {
      const tags = row.post_tags?.map((pt) => pt.tags).filter(Boolean) ?? [];
      return transformRowToPostMeta(row, row.categories, tags);
    });

    return posts;
  } catch (e) {
    if (shouldFallback(e)) return getMarkdownPostMeta();
    throw e;
  }
}

/** 根据 slug 获取单篇文章（含正文） */
export async function getPublishedPostBySlug(
  slug: string
): Promise<Post | undefined> {
  if (!isSupabaseConfigured()) return getMarkdownPostBySlug(slug);

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*), post_tags(tag_id, tags(*))')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    if (!data) return getMarkdownPostBySlug(slug);

    const row = data as unknown as PostFull;
    const tags = row.post_tags?.map((pt) => pt.tags).filter(Boolean) ?? [];
    return transformRowToPost(row, row.categories, tags);
  } catch (e) {
    if (shouldFallback(e)) return getMarkdownPostBySlug(slug);
    throw e;
  }
}

/** 获取所有分类列表 */
export async function getCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (e) {
    if (shouldFallback(e)) return [];
    throw e;
  }
}

/** 获取分类（含文章数） */
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, posts!inner(count)')
      .eq('posts.status', 'published')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!hasData(data)) return [];

    return (data as unknown as CategoryWithCount[]).map((row) => ({
      ...row,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      post_count: (row as any).posts?.[0]?.count ?? 0,
    }));
  } catch (e) {
    if (shouldFallback(e)) return [];
    throw e;
  }
}

/** 获取某分类下的已发布文章 */
export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<PostMeta[]> {
  if (!isSupabaseConfigured()) return getMarkdownPostsByCategory(categorySlug);

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories!inner(*), post_tags(tag_id, tags(*))')
      .eq('status', 'published')
      .eq('categories.slug', categorySlug)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!hasData(data)) return getMarkdownPostsByCategory(categorySlug);

    return (data as unknown as PostFull[]).map((row) => {
      const tags = row.post_tags?.map((pt) => pt.tags).filter(Boolean) ?? [];
      return transformRowToPostMeta(row, row.categories, tags);
    });
  } catch (e) {
    if (shouldFallback(e)) return getMarkdownPostsByCategory(categorySlug);
    throw e;
  }
}

/** 获取所有标签 */
export async function getTagsWithCount(): Promise<TagCount[]> {
  if (!isSupabaseConfigured()) return getMarkdownTags();

  try {
    const { data, error } = await supabase.from('tags').select('*');

    if (error) throw error;
    if (!hasData(data)) return getMarkdownTags();

    // 统计每个标签下的 published 文章数
    const tagsWithCount: TagCount[] = [];
    for (const tag of data) {
      const { count, error: countErr } = await supabase
        .from('post_tags')
        .select('*, posts!inner(status)', { count: 'exact', head: true })
        .eq('tag_id', tag.id)
        .eq('posts.status', 'published');

      if (!countErr) {
        tagsWithCount.push({ tag: tag.name, count: count ?? 0 });
      }
    }

    return tagsWithCount.sort((a, b) => b.count - a.count);
  } catch (e) {
    if (shouldFallback(e)) return getMarkdownTags();
    throw e;
  }
}

/** 获取某标签下的已发布文章 */
export async function getPostsByTagName(
  tagName: string
): Promise<PostMeta[]> {
  if (!isSupabaseConfigured()) return getMarkdownPostsByTag(tagName);

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*), post_tags!inner(tag_id, tags!inner(*))')
      .eq('status', 'published')
      .eq('post_tags.tags.name', tagName)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!hasData(data)) return getMarkdownPostsByTag(tagName);

    return (data as unknown as PostFull[]).map((row) => {
      const tags = row.post_tags?.map((pt) => pt.tags).filter(Boolean) ?? [];
      return transformRowToPostMeta(row, row.categories, tags);
    });
  } catch (e) {
    if (shouldFallback(e)) return getMarkdownPostsByTag(tagName);
    throw e;
  }
}
