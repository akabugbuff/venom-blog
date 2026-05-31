import React, { useRef, useState, type HTMLAttributes } from 'react';

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  children: React.ReactElement;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const language =
    ((children.props as Record<string, unknown>)?.['data-language'] as string) ?? 'text';

  const handleCopy = async () => {
    const text = preRef.current?.querySelector('code')?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 not-prose">
      <div className="flex items-center justify-between rounded-t-lg bg-stone-800 px-4 py-2 text-xs text-stone-400">
        <span className="font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="hover:text-stone-200 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-b-lg bg-stone-900 p-4 text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
