import { Link } from 'react-router-dom';
import { usePostMeta } from '../../hooks/usePosts';

export function RecentUpdates() {
  const { posts } = usePostMeta();

  // 按 updated 优先，没有则用 date，倒序
  const sorted = [...posts]
    .sort((a, b) => {
      const aTime = a.frontmatter.updated ?? a.frontmatter.date;
      const bTime = b.frontmatter.updated ?? b.frontmatter.date;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })
    .slice(0, 5);

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">
          最近更新
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">
        最近更新
      </h3>
      <ul className="space-y-3.5">
        {sorted.map((post) => {
          const dateStr = (post.frontmatter.updated ?? post.frontmatter.date);
          const date = new Date(dateStr).toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
          });
          return (
            <li key={post.slug} className="flex items-start gap-3">
              {/* Dot */}
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-400 dark:bg-primary-500" />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/blog/${post.slug}`}
                  className="block truncate text-sm font-medium text-slate-700 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
                >
                  {post.frontmatter.title}
                </Link>
              </div>
              <time
                dateTime={dateStr}
                className="mt-0.5 flex-shrink-0 text-xs text-slate-400 dark:text-slate-500"
              >
                {date}
              </time>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Link
          to="/archive"
          className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          查看更多 &rarr;
        </Link>
      </div>
    </div>
  );
}
