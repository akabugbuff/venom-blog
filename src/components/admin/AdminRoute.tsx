import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * 后台路由守卫
 * - 加载中 → 显示 loading
 * - 未登录 → 跳转 /admin/login
 * - 已登录但非 admin → 显示无权限
 * - admin → 正常渲染
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="mt-4 text-sm text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl dark:bg-red-950">
            🚫
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">无权限访问</h1>
          <p className="mt-2 text-sm text-slate-500">
            当前账号不是管理员，无法访问后台。
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
