import { useState, useEffect } from 'react';
import type { Post, PostMeta, TagCount } from '../types/post';
import {
  getPublishedPostMeta,
  getPublishedPostBySlug,
  getPostsByCategorySlug,
  getPostsByTagName,
  getTagsWithCount,
  getDashboardStats,
} from '../lib/api';

// ── 通用 async hook 工厂 ──

/** 基础异步数据 hook */
function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.error('数据加载失败:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading };
}

// ── Post Hooks ──

export function usePosts(): { posts: Post[]; loading: boolean } {
  const { data, loading } = useAsync(async () => {
    // getAllPosts is not needed for frontend — use PostMeta
    const meta = await getPublishedPostMeta();
    return meta as unknown as Post[];
  });
  return { posts: data ?? [], loading };
}

export function usePostMeta(): { posts: PostMeta[]; loading: boolean } {
  const { data, loading } = useAsync(getPublishedPostMeta);
  return { posts: data ?? [], loading };
}

export function usePost(slug: string): { post: Post | undefined; loading: boolean } {
  const { data, loading } = useAsync(
    () => getPublishedPostBySlug(slug),
    [slug]
  );
  return { post: data ?? undefined, loading };
}

export function usePostsByCategory(categorySlug: string): {
  posts: PostMeta[];
  loading: boolean;
} {
  const { data, loading } = useAsync(
    () => getPostsByCategorySlug(categorySlug),
    [categorySlug]
  );
  return { posts: data ?? [], loading };
}

export function usePostsByTag(tag: string): {
  posts: PostMeta[];
  loading: boolean;
} {
  const { data, loading } = useAsync(
    () => getPostsByTagName(tag),
    [tag]
  );
  return { posts: data ?? [], loading };
}

export function useTags(): { tags: TagCount[]; loading: boolean } {
  const { data, loading } = useAsync(getTagsWithCount);
  return { tags: data ?? [], loading };
}

// ── Stats Hook ──

export function useStats(): {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    categoryCount: number;
    tagCount: number;
  };
  loading: boolean;
} {
  const { data, loading } = useAsync(getDashboardStats);
  return {
    stats: data ?? {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      categoryCount: 0,
      tagCount: 0,
    },
    loading,
  };
}
