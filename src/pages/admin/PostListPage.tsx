import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllPostsAdmin, deletePost } from '../../lib/api';
import type { PostRow } from '../../lib/supabase-types';

export function PostListPage() {
  const [posts, setPosts] = useState<(PostRow & { categories?: { name: string } | null; post_tags?: { tags: { name: string } }[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch (e) {
      console.error('加载文章列表失败:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`确定要删除「${title}」吗？此操作不可撤销。`)) return;
    setDeleting(id);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('删除失败:', e);
      alert('删除失败');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            文章管理
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            共 {posts.length} 篇文章
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          新建文章
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500">暂无文章</p>
          <Link
            to="/admin/posts/new"
            className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            创建第一篇文章 &rarr;
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  标题
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 sm:table-cell">
                  分类
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 lg:table-cell">
                  状态
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 lg:table-cell">
                  更新
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-950"
                >
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate font-medium text-slate-900 dark:text-slate-100">
                      {post.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400 truncate max-w-xs">
                      {post.slug}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 dark:text-slate-400 sm:table-cell">
                    {post.categories?.name ?? '—'}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}
                    >
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-slate-400 lg:table-cell">
                    {new Date(post.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        {deleting === post.id ? '...' : '删除'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
