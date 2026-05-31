import { Link } from 'react-router-dom';

interface TagBadgeProps {
  tag: string;
  href?: string;
}

export function TagBadge({ tag, href }: TagBadgeProps) {
  const className =
    'inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors';

  if (href) {
    return (
      <Link to={href} className={className}>
        {tag}
      </Link>
    );
  }

  return <span className={className}>{tag}</span>;
}
