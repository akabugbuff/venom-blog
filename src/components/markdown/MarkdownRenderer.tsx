import { MarkdownContent } from '../../lib/markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-stone prose-sm max-w-none dark:prose-invert md:prose lg:prose-lg">
      <MarkdownContent content={content} />
    </div>
  );
}
