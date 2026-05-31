import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface MediaItem {
  name: string;
  url: string;
  created_at: string;
  size: number;
}

const BUCKET = 'covers';

export function MediaPage() {
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list();
      if (error) throw error;
      const items: MediaItem[] = (data ?? [])
        .filter((f) => f.id)
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
          created_at: f.created_at ?? '',
          size: f.metadata?.size ?? 0,
        }))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
      setFiles(items);
    } catch (e) {
      console.error('加载文件失败:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
      if (error) throw error;
      await loadFiles();
    } catch (e) {
      console.error('上传失败:', e);
      alert('上传失败: ' + (e as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`删除「${name}」？`)) return;
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([name]);
      if (error) throw error;
      setFiles((prev) => prev.filter((f) => f.name !== name));
    } catch (e) {
      alert('删除失败: ' + (e as Error).message);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            媒体管理
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            上传文章封面图，共 {files.length} 个文件
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              上传中...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              上传图片
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
            点击上方按钮上传图片
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Preview */}
              <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatSize(file.size)}
                </p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex-1 rounded-lg bg-primary-50 px-2 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400 dark:hover:bg-primary-900"
                  >
                    {copied === file.url ? '已复制!' : '复制 URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload tip */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 上传后在文章编辑页面的"封面图 URL"中粘贴图片链接即可使用。
          支持的格式：PNG、JPG、GIF、WebP，单个文件不超过 5MB。
        </p>
      </div>
    </div>
  );
}
