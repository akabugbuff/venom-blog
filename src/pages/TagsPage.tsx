import { Link } from 'react-router-dom';
import { useTags } from '../hooks/usePosts';
import { Container } from '../components/common/Container';

export function TagsPage() {
  const { tags } = useTags();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          标签
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          共 {tags.length} 个标签
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-400"
            >
              <span className="text-base">#</span>
              {tag}
              <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-primary-900 dark:group-hover:text-primary-400">
                {count}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500">暂无标签</p>
        </div>
      )}
    </Container>
  );
}
