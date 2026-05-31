import { Container } from '../components/common/Container';

export function AboutPage() {
  return (
    <Container className="py-12 sm:py-16">
      {/* 个人介绍卡片 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-3xl shadow-lg shadow-primary-200 dark:shadow-none">
            🛡️
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
              网络空间安全学习者
            </h1>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                Web安全
              </span>
              <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                密码学
              </span>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                渗透测试
              </span>
              <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                容灾实验
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 正文内容 */}
      <div className="mt-12 max-w-4xl space-y-10">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            关于
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
            我是一名网络安全学习者，这个博客用于记录网络空间安全学习过程中的
            实验笔记、漏洞分析和安全工具使用方法。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            博客内容
          </h2>
          <ul className="mt-3 space-y-3">
            {[
              { icon: '🌐', label: 'Web 安全', desc: 'XSS、SQL 注入、CSRF 等常见漏洞分析与防御' },
              { icon: '💻', label: '二进制安全', desc: '逆向工程、缓冲区溢出、ROP 链构造' },
              { icon: '🔐', label: '密码学', desc: '对称/非对称加密、哈希函数、数字签名' },
              { icon: '🚩', label: 'CTF 竞赛', desc: '解题 Writeup 和竞赛经验分享' },
              { icon: '🛠️', label: '安全工具', desc: 'Burp Suite、Wireshark、Metasploit 等工具教程' },
            ].map(({ icon, label, desc }) => (
              <li
                key={label}
                className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 text-lg dark:from-primary-950 dark:to-accent-950">
                  {icon}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {label}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            关于本博客
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
            本博客使用 React + Vite + Tailwind CSS 构建，文章采用 Markdown
            编写，代码高亮由 Prism.js 提供，部署在 GitHub Pages。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            联系方式
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
            欢迎通过{' '}
            <a
              href="https://github.com/akabugbuff"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              GitHub (@akabugbuff)
            </a>
            {' '}与我交流。
          </p>
        </section>
      </div>
    </Container>
  );
}
