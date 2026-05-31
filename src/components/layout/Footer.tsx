export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          网络空间安全实验博客 · React + Vite + Tailwind CSS · Markdown &amp;
          Prism.js
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Venom — All rights reserved
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            🔒 安全
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-0.5 font-medium text-accent-600 dark:bg-accent-950 dark:text-accent-400">
            📖 学习
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            🧪 实验
          </span>
        </div>
      </div>
    </footer>
  );
}
