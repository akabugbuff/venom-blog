import { Link } from 'react-router-dom';
import { usePostMeta } from '../hooks/usePosts';
import { Container } from '../components/common/Container';
import { getCategory } from '../lib/categories';

export function ArchivePage() {
  const { posts } = usePostMeta();

  const groupedByYear = posts.reduce(
    (acc, post) => {
      const year = new Date(post.frontmatter.date).getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, typeof posts>
  );

  const years = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          归档
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          共 {posts.length} 篇文章
        </p>
      </div>

      {years.length > 0 ? (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              <h2 className="sticky top-16 z-10 -mx-4 mb-6 bg-[#F8FBFF]/90 px-4 py-2 text-2xl font-bold text-primary-600 backdrop-blur dark:bg-slate-950/90 dark:text-primary-400 sm:px-6">
                {year}
              </h2>
              <div className="space-y-3">
                {groupedByYear[year].map((post) => {
                  const date = new Date(
                    post.frontmatter.date
                  ).toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                  });
                  const category = post.frontmatter.category
                    ? getCategory(post.frontmatter.category)
                    : undefined;

                  return (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400 transition-colors truncate">
                          {post.frontmatter.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                          {post.frontmatter.description}
                        </p>
                        {category && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                            {category.icon} {category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 sm:flex-shrink-0">
                        <time dateTime={post.frontmatter.date}>{date}</time>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                          {post.readingTime} 分钟
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500">暂无文章</p>
        </div>
      )}
    </Container>
  );
}
