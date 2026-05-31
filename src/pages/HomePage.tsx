import { Link } from 'react-router-dom';
import { usePostMeta } from '../hooks/usePosts';
import { categories } from '../lib/categories';
import { getCategoryPostCount } from '../lib/posts';
import { Container } from '../components/common/Container';
import { HeroSection } from '../components/home/HeroSection';
import { ProfileCard } from '../components/home/ProfileCard';
import { TagCloud } from '../components/home/TagCloud';
import { RecentUpdates } from '../components/home/RecentUpdates';
import { PostCard } from '../components/posts/PostCard';

export function HomePage() {
  const { posts } = usePostMeta();
  const recentPosts = posts.slice(0, 3);

  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Two-column layout ── */}
      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* ─── Left: Main content (~70%) ─── */}
        <div className="flex-1 space-y-10">
          {/* 实验分类 */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  实验分类
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  按学习领域浏览实验笔记
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((cat) => {
                const count = getCategoryPostCount(cat.slug);
                return (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 text-xl dark:from-primary-950 dark:to-accent-950">
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400 transition-colors">
                          {cat.name}
                        </h3>
                        <span className="flex-shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          {count}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 最新实验 */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  最新实验
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  最近发布的实验笔记与安全研究
                </p>
              </div>
              {posts.length > 3 && (
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  查看全部
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {recentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
                  在 <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">/posts</code> 目录新建 .md 文件即可开始写作
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ─── Right: Sidebar (~30%) ─── */}
        <aside className="w-full space-y-6 lg:w-80 lg:flex-shrink-0">
          <ProfileCard />
          <TagCloud />
          <RecentUpdates />
        </aside>
      </div>
    </Container>
  );
}
