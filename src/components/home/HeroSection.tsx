import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-white to-accent-50 p-8 shadow-lg shadow-primary-100/50 sm:p-12 lg:p-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:shadow-none">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #2563EB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Top-right glow */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl dark:bg-primary-600/10" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-400/10 blur-3xl dark:bg-accent-600/10" />
      </div>

      <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
        {/* Left: Text content */}
        <div className="w-full max-w-xl flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.2] text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15] dark:text-slate-100">
            记录网络安全实验
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              沉淀攻防学习笔记
            </span>
          </h1>

          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-medium text-primary-600 lg:justify-start dark:text-primary-400">
            <span className="rounded-full bg-primary-50 px-3 py-1 dark:bg-primary-950">密码学</span>
            <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-600 dark:bg-accent-950 dark:text-accent-400">容灾实验</span>
            <span className="rounded-full bg-primary-50 px-3 py-1 dark:bg-primary-950">渗透测试</span>
            <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-600 dark:bg-accent-950 dark:text-accent-400">Web安全</span>
          </div>

          <p className="mt-6 max-w-xl leading-relaxed text-slate-600 mx-auto lg:mx-0 dark:text-slate-400">
            这里整理我在网络空间安全学习过程中的实验记录、漏洞分析、工具使用和技术总结，持续沉淀自己的安全知识体系。
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-300 transition-all dark:shadow-none dark:hover:shadow-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              开始浏览
            </Link>
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-400 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              文章归档
            </Link>
          </div>
        </div>

        {/* Right: Decorative illustration */}
        <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
          <div className="relative">
            {/* Main shield */}
            <div className="h-48 w-48 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 shadow-2xl shadow-primary-300/40 dark:shadow-none">
              <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
                <path
                  d="M12 1L3 5V11C3 16.5 7 21.5 12 22C17 21.5 21 16.5 21 11V5L12 1Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="rgba(255,255,255,0.15)"
                />
                <path
                  d="M9 12L11.5 15L15 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-3 -right-3 h-12 w-12 rounded-xl bg-accent-400 shadow-lg flex items-center justify-center text-white text-lg font-bold">
              &#128274;
            </div>
            <div className="absolute -bottom-2 -left-2 h-14 w-14 rounded-2xl bg-white shadow-lg flex items-center justify-center dark:bg-slate-800">
              <svg className="h-7 w-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
