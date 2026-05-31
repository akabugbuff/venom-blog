import { usePostMeta } from '../hooks/usePosts';
import { Container } from '../components/common/Container';
import { PostCard } from '../components/posts/PostCard';

export function BlogPage() {
  const { posts } = usePostMeta();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          全部文章
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
          <p className="text-slate-400 dark:text-slate-500">暂无文章</p>
        </div>
      )}
    </Container>
  );
}
