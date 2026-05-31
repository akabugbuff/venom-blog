import { Link } from 'react-router-dom';
import { Container } from '../components/common/Container';

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 text-5xl font-extrabold text-primary-600 dark:from-primary-950 dark:to-accent-950 dark:text-primary-400">
        404
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
        页面未找到
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        你访问的页面不存在或已被移动
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl dark:shadow-none"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        返回首页
      </Link>
    </Container>
  );
}
