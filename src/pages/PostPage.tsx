import { useParams, Link } from 'react-router-dom';
import { usePost } from '../hooks/usePosts';
import { Container } from '../components/common/Container';
import { PostMeta } from '../components/posts/PostMeta';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = usePost(slug ?? '');

  if (loading) {
    return (
      <Container className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </Container>
    );
  }

  if (!slug || !post) {
    return (
      <Container className="py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          文章未找到
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          文章 "{slug}" 不存在或已被删除
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-1 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回文章列表
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <PostMeta
          frontmatter={post.frontmatter}
          readingTime={post.readingTime}
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>

      <div className="mx-auto mt-12 max-w-4xl border-t border-slate-200 pt-8 dark:border-slate-800">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回文章列表
        </Link>
      </div>
    </Container>
  );
}
