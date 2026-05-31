import { useParams, Link } from 'react-router-dom';
import { usePostsByCategory } from '../hooks/usePosts';
import { getCategory } from '../lib/categories';
import { Container } from '../components/common/Container';
import { PostCard } from '../components/posts/PostCard';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategory(slug) : undefined;
  const { posts } = usePostsByCategory(slug ?? '');

  if (!slug || !category) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          分类不存在
        </h1>
        <Link
          to="/"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          &larr; 返回首页
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      {/* Category header */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-4xl dark:from-primary-950 dark:to-accent-950">
            {category.icon}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {category.description}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 dark:text-slate-500">
          共 {posts.length} 篇文章
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500">
            该分类下暂无文章
          </p>
        </div>
      )}

      <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
      </div>
    </Container>
  );
}
