import { useParams, Link } from 'react-router-dom';
import { usePostsByTag } from '../hooks/usePosts';
import { Container } from '../components/common/Container';
import { PostCard } from '../components/posts/PostCard';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { posts } = usePostsByTag(tag ?? '');

  if (!tag) {
    return (
      <Container className="py-16 text-center">
        <p className="text-slate-400 dark:text-slate-500">未指定标签</p>
        <Link
          to="/tags"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          &larr; 所有标签
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          <span className="text-primary-600 dark:text-primary-400">#</span>{' '}
          {tag}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
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
            该标签下暂无文章
          </p>
        </div>
      )}

      <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
        <Link
          to="/tags"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          所有标签
        </Link>
      </div>
    </Container>
  );
}
