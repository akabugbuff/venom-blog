import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { getAllTagsSimple, createTag, updateTag, deleteTag } from '../../lib/api';
import type { TagRow } from '../../lib/supabase-types';

export function TagListPage() {
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTags(await getAllTagsSimple());
    } catch {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setName(''); setSlug(''); setEditId(null); setShowForm(false); setError(null);
  }

  function startEdit(t: TagRow) {
    setName(t.name); setSlug(t.slug); setEditId(t.id); setShowForm(true);
  }

  function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) { setError('名称和 slug 不能为空'); return; }
    setSaving(true); setError(null);
    try {
      const input = { name: name.trim(), slug: slug.trim() };
      if (editId) {
        await updateTag(editId, input);
        setTags((prev) => prev.map((t) => (t.id === editId ? { ...t, ...input } : t)));
      } else {
        const created = await createTag(input);
        setTags((prev) => [...prev, created]);
      }
      resetForm();
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg.includes('duplicate') ? 'slug 已存在' : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`删除标签「${name}」？`)) return;
    try {
      await deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch { setError('删除失败'); }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">标签管理</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">共 {tags.length} 个标签</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          新建标签
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">{editId ? '编辑标签' : '新建标签'}</h2>
            {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">名称</label>
                <input value={name} onChange={(e) => { setName(e.target.value); if (!editId) setSlug(slugify(e.target.value)); }} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" placeholder="如：SQL注入" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" placeholder="sql-injection" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{saving ? '保存中...' : '保存'}</button>
              <button type="button" onClick={resetForm} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">取消</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
      ) : tags.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800"><p className="text-slate-400">暂无标签</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">名称</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">slug</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tags.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">#{t.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{t.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(t)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">编辑</button>
                    <button onClick={() => handleDelete(t.id, t.name)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">删除</button>
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
