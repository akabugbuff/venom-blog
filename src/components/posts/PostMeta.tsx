import { Link } from 'react-router-dom';
import type { PostFrontmatter } from '../../types/post';
import { getCategory } from '../../lib/categories';

interface PostMetaProps {
  frontmatter: PostFrontmatter;
  readingTime: number;
}

export function PostMeta({ frontmatter, readingTime }: PostMetaProps) {
  const date = new Date(frontmatter.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const category = frontmatter.category
    ? getCategory(frontmatter.category)
    : undefined;

  return (
    <header className="mb-10">
      {/* Category badge */}
      {category && (
        <Link
          to={`/category/${category.slug}`}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400 dark:hover:bg-primary-900"
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </Link>
      )}

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {frontmatter.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
        <time dateTime={frontmatter.date}>
          <svg
            className="mr-1.5 inline-block h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {date}
        </time>
        <span>·</span>
        <span>
          <svg
            className="mr-1.5 inline-block h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          阅读 {readingTime} 分钟
        </span>
        {frontmatter.updated && (
          <>
            <span>·</span>
            <span>
              更新于{' '}
              {new Date(frontmatter.updated).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </>
        )}
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
