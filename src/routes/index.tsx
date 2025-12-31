import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const PermissionsPage = lazy(() => import('@/pages/PermissionsPage'))
const RolesPage = lazy(() => import('@/pages/RolesPage'))
const RoleDetailPage = lazy(() => import('@/pages/RoleDetailPage'))
const AdminsPage = lazy(() => import('@/pages/AdminsPage'))
const CreateAdminPage = lazy(() => import('@/pages/CreateAdminPage'))
const EditAdminPage = lazy(() => import('@/pages/EditAdminPage'))
const AdminDetailPage = lazy(() => import('@/pages/AdminDetailPage'))

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
    element: <ProtectedRoute><PermissionsPage /></ProtectedRoute>,
  },
  {
    path: '/roles',
    element: <ProtectedRoute><RolesPage /></ProtectedRoute>,
  },
  {
    path: '/roles/:id',
    element: <ProtectedRoute><RoleDetailPage /></ProtectedRoute>,
  },
  {
    path: '/admins',
    element: <ProtectedRoute><AdminsPage /></ProtectedRoute>,
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
])

