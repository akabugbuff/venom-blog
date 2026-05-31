import { Link } from 'react-router-dom';
import type { PostMeta } from '../../types/post';
import { getCategory } from '../../lib/categories';

interface PostCardProps {
  post: PostMeta;
}

/** 根据分类 slug 返回默认渐变封面样式 */
function getCoverStyle(categorySlug?: string): string {
  const gradients: Record<string, string> = {
    'web-security': 'from-blue-500 to-cyan-500',
    'binary-security': 'from-slate-600 to-slate-800',
    cryptography: 'from-teal-500 to-emerald-500',
    ctf: 'from-red-500 to-orange-500',
    tools: 'from-violet-500 to-purple-600',
  };
  return gradients[categorySlug ?? ''] ?? 'from-primary-500 to-accent-500';
}

function getCoverIcon(categorySlug?: string): string {
  const icons: Record<string, string> = {
    'web-security': '🌐',
    'binary-security': '💻',
    cryptography: '🔐',
    ctf: '🚩',
    tools: '🛠️',
  };
  return icons[categorySlug ?? ''] ?? '📝';
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const date = new Date(frontmatter.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const category = frontmatter.category
    ? getCategory(frontmatter.category)
    : undefined;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800">
      {/* Cover image area */}
      <Link to={`/blog/${slug}`} className="block">
        <div
          className={`flex h-40 items-center justify-center bg-gradient-to-br ${getCoverStyle(frontmatter.category)}`}
        >
          <span className="text-5xl opacity-80 drop-shadow-lg">
            {getCoverIcon(frontmatter.category)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <time dateTime={frontmatter.date}>{date}</time>
          <span>·</span>
          <span>阅读 {readingTime} 分钟</span>
        </div>

        {/* Title */}
        <Link
          to={`/blog/${slug}`}
          className="mt-2 block font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400"
        >
          {frontmatter.title}
        </Link>

        {/* Description */}
        <p className="mt-1.5 flex-1 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {frontmatter.description}
        </p>

        {/* Category + Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {category && (
            <Link
              to={`/category/${category.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400 dark:hover:bg-primary-900"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          )}
          {frontmatter.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
