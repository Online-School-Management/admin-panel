import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))
const CreateUserPage = lazy(() => import('@/pages/CreateUserPage'))
const EditUserPage = lazy(() => import('@/pages/EditUserPage'))

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
    path: '/',
    element: <DashboardPage />, // Will redirect in App.tsx
  },
]

