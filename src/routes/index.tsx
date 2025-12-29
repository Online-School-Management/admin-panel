import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const CreateUserPage = lazy(() => import('@/pages/CreateUserPage'))
const EditUserPage = lazy(() => import('@/pages/EditUserPage'))
const PermissionsPage = lazy(() => import('@/pages/PermissionsPage'))
const RolesPage = lazy(() => import('@/pages/RolesPage'))
const RoleDetailPage = lazy(() => import('@/pages/RoleDetailPage'))
const AdminsPage = lazy(() => import('@/pages/AdminsPage'))
const CreateAdminPage = lazy(() => import('@/pages/CreateAdminPage'))
const EditAdminPage = lazy(() => import('@/pages/EditAdminPage'))
const AdminDetailPage = lazy(() => import('@/pages/AdminDetailPage'))

/**
 * Route configuration
 * All routes are defined here for better organization
 */
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/new',
    element: (
      <ProtectedRoute>
        <CreateUserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id/edit',
    element: (
      <ProtectedRoute>
        <EditUserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions',
    element: (
      <ProtectedRoute>
        <PermissionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/roles',
    element: (
      <ProtectedRoute>
        <RolesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/roles/:id',
    element: (
      <ProtectedRoute>
        <RoleDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admins',
    element: (
      <ProtectedRoute>
        <AdminsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admins/new',
    element: (
      <ProtectedRoute>
        <CreateAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admins/:id/edit',
    element: (
      <ProtectedRoute>
        <EditAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admins/:id',
    element: (
      <ProtectedRoute>
        <AdminDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <DashboardPage />, // Will redirect in App.tsx
  },
]

