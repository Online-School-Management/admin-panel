import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load pages for code splitting
// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/login'))

// Dashboard
const DashboardPage = lazy(() => import('@/pages/dashboard'))

// Admin pages
const AdminsListPage = lazy(() => import('@/pages/admin/list'))
const CreateAdminPage = lazy(() => import('@/pages/admin/create'))
const EditAdminPage = lazy(() => import('@/pages/admin/edit'))
const AdminDetailPage = lazy(() => import('@/pages/admin/detail'))

// Role pages
const RolesListPage = lazy(() => import('@/pages/roles/list'))
const RoleDetailPage = lazy(() => import('@/pages/roles/detail'))

// Permission pages
const PermissionsListPage = lazy(() => import('@/pages/permissions/list'))

// Teacher pages
const TeachersListPage = lazy(() => import('@/pages/teachers/list'))
const CreateTeacherPage = lazy(() => import('@/pages/teachers/create'))
const EditTeacherPage = lazy(() => import('@/pages/teachers/edit'))
const TeacherDetailPage = lazy(() => import('@/pages/teachers/detail'))

/**
 * Route configuration using createBrowserRouter (data router API)
 * Each route is individually wrapped with ProtectedRoute (which includes AdminLayout)
 * This pattern matches the example folder implementation
 * The data router API handles component instances more efficiently
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  
  // Protected routes - each wrapped individually with ProtectedRoute
  {
    path: '/',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/permissions',
    element: <ProtectedRoute><PermissionsListPage /></ProtectedRoute>,
  },
  {
    path: '/roles',
    element: <ProtectedRoute><RolesListPage /></ProtectedRoute>,
  },
  {
    path: '/roles/:id',
    element: <ProtectedRoute><RoleDetailPage /></ProtectedRoute>,
  },
  {
    path: '/admins',
    element: <ProtectedRoute><AdminsListPage /></ProtectedRoute>,
  },
  {
    path: '/admins/new',
    element: <ProtectedRoute><CreateAdminPage /></ProtectedRoute>,
  },
  {
    path: '/admins/:id/edit',
    element: <ProtectedRoute><EditAdminPage /></ProtectedRoute>,
  },
  {
    path: '/admins/:id',
    element: <ProtectedRoute><AdminDetailPage /></ProtectedRoute>,
  },
  {
    path: '/teachers',
    element: <ProtectedRoute><TeachersListPage /></ProtectedRoute>,
  },
  {
    path: '/teachers/new',
    element: <ProtectedRoute><CreateTeacherPage /></ProtectedRoute>,
  },
  {
    path: '/teachers/:slug/edit',
    element: <ProtectedRoute><EditTeacherPage /></ProtectedRoute>,
  },
  {
    path: '/teachers/:slug',
    element: <ProtectedRoute><TeacherDetailPage /></ProtectedRoute>,
  },
])

