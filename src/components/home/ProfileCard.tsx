import { useStats, useTags } from '../../hooks/usePosts';
import { categories } from '../../lib/categories';

export function ProfileCard() {
  const { stats } = useStats();
  const { tags } = useTags();

  const statItems = [
    { label: '文章', value: stats.publishedPosts },
    { label: '分类', value: categories.length },
    { label: '标签', value: tags.length },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-3xl shadow-lg shadow-primary-200 dark:shadow-none">
          🛡️
        </div>
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
          安全探索者
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          热爱网络安全技术，专注于学习与实践。在这里记录实验过程、总结知识要点，分享学习心得。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4 dark:divide-slate-800 dark:border-slate-800">
        {statItems.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {value}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
