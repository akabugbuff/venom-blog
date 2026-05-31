import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardStats } from '../../lib/api';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categoryCount: 0,
    tagCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: '文章总数', value: stats.totalPosts, icon: '📝', color: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900' },
    { label: '已发布', value: stats.publishedPosts, icon: '✅', color: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900' },
    { label: '草稿', value: stats.draftPosts, icon: '📄', color: 'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900' },
    { label: '分类', value: stats.categoryCount, icon: '📂', color: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900' },
    { label: '标签', value: stats.tagCount, icon: '🏷️', color: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          仪表盘
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          欢迎回来，{user?.email}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`rounded-xl border border-slate-200 bg-gradient-to-br ${color} p-5 dark:border-slate-800`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{icon}</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? '—' : value}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          快捷操作
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: '新建文章', desc: '创建一篇新的实验笔记', to: '/admin/posts/new', icon: '✍️' },
            { label: '管理分类', desc: '添加或编辑文章分类', to: '/admin/categories', icon: '📂' },
            { label: '管理标签', desc: '管理文章标签列表', to: '/admin/tags', icon: '🏷️' },
          ].map(({ label, desc, to, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800"
            >
              <span className="text-xl">{icon}</span>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
