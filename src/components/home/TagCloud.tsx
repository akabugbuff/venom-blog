import { Link } from 'react-router-dom';
import { useTags } from '../../hooks/usePosts';

const pillStyles = [
  'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900',
  'bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-400 dark:hover:bg-teal-900',
  'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900',
  'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900',
  'bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-400 dark:hover:bg-sky-900',
  'bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900',
];

export function TagCloud() {
  const { tags } = useTags();

  if (tags.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">
          标签云
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">暂无标签</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">
        标签云
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }, i) => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              pillStyles[i % pillStyles.length]
            }`}
          >
            {tag}
            <span className="opacity-60">({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
