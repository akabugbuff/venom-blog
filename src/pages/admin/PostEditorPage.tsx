import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, updatePost, getPostByIdAdmin, getCategories, getAllTagsSimple } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import type { CategoryRow, TagRow, PostFull } from '../../lib/supabase-types';

/** 用标题生成默认 slug */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

export function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Data
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(isEdit);

  // Load categories + tags
  useEffect(() => {
    getCategories().then(setCategories);
    getAllTagsSimple().then(setTags);
  }, []);

  // Load existing post for edit
  const loadPost = useCallback(async () => {
    if (!id) return;
    setLoadingPost(true);
    try {
      const post = await getPostByIdAdmin(id) as PostFull | null;
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setDescription(post.description);
        setContent(post.content);
        setCategoryId(post.category_id ?? '');
        setCoverUrl(post.cover_url);
        setStatus(post.status);
        setSelectedTagIds(post.post_tags?.map((pt) => pt.tag_id) ?? []);
      }
    } catch (e) {
      console.error('加载文章失败:', e);
    } finally {
      setLoadingPost(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) loadPost();
  }, [isEdit, loadPost]);

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit || !slug) {
      setSlug(slugify(value));
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim()) {
      setError('标题和 slug 不能为空');
      return;
    }

    setSaving(true);
    try {
      const input = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        content,
        category_id: categoryId || null,
        cover_url: coverUrl.trim(),
        status,
        tag_ids: selectedTagIds,
      };

      if (isEdit && id) {
        await updatePost(id, input);
      } else {
        await createPost(input);
      }

      navigate('/admin/posts', { replace: true });
    } catch (e) {
      console.error('保存失败:', e);
      const msg = (e as Error).message;
      if (msg.includes('duplicate key') || msg.includes('unique')) {
        setError('slug 已存在，请更换');
      } else {
        setError('保存失败: ' + msg);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isEdit ? '编辑文章' : '新建文章'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title + Slug */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="文章标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="article-slug"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            摘要
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="一句话描述文章内容"
          />
        </div>

        {/* Category + Status + Cover */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">— 无 —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              状态
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="draft">📄 草稿</option>
              <option value="published">✅ 发布</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              封面图 URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="留空则使用默认封面，或点击右侧上传"
              />
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                上传
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) { alert('文件不能超过 5MB'); return; }
                    const ext = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
                    const { error } = await supabase.storage.from('covers').upload(fileName, file);
                    if (error) { alert('上传失败: ' + error.message); return; }
                    const url = supabase.storage.from('covers').getPublicUrl(fileName).data.publicUrl;
                    setCoverUrl(url);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            标签
          </label>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300 dark:bg-primary-950 dark:text-primary-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">暂无标签，可先去标签管理添加</p>
          )}
        </div>

        {/* Content (textarea for now) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            正文 (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="用 Markdown 编写正文..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
