import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AdminRoute } from '../components/admin/AdminRoute';
import { AdminLayout } from '../components/admin/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { PostPage } from '../pages/PostPage';
import { TagsPage } from '../pages/TagsPage';
import { TagPage } from '../pages/TagPage';
import { AboutPage } from '../pages/AboutPage';
import { ArchivePage } from '../pages/ArchivePage';
import { CategoryPage } from '../pages/CategoryPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { PostListPage } from '../pages/admin/PostListPage';
import { PostEditorPage } from '../pages/admin/PostEditorPage';
import { CategoryListPage } from '../pages/admin/CategoryListPage';
import { TagListPage } from '../pages/admin/TagListPage';
import { MediaPage } from '../pages/admin/MediaPage';

export function AppRouter() {
  return (
    <Routes>
      {/* ── 前台路由 ── */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<PostPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="tags/:tag" element={<TagPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ── 后台路由 ── */}
      <Route path="admin/login" element={<LoginPage />} />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/new" element={<PostEditorPage />} />
        <Route path="posts/:id/edit" element={<PostEditorPage />} />
        {/* 以下路由将在后续阶段实现 */}
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="tags" element={<TagListPage />} />
        <Route path="media" element={<MediaPage />} />
      </Route>
    </Routes>
  );
}
