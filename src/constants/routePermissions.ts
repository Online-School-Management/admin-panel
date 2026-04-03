import { matchPath } from 'react-router-dom'

/**
 * First matching rule wins; list more specific paths before param routes.
 * Must stay aligned with backend route middleware slugs and navigation.permission.
 */
const ROUTE_PERMISSION_RULES: { path: string; permission: string }[] = [
  { path: '/admins/new', permission: 'admins.create' },
  { path: '/admins/:id/edit', permission: 'admins.update' },
  { path: '/admins/:id', permission: 'admins.view' },
  { path: '/admins', permission: 'admins.view' },

  { path: '/roles/:id', permission: 'roles.view' },
  { path: '/roles', permission: 'roles.view' },

  { path: '/permissions', permission: 'permissions.view' },

  { path: '/teachers/new', permission: 'teachers.create' },
  { path: '/teachers/:slug/edit', permission: 'teachers.update' },
  { path: '/teachers/:slug', permission: 'teachers.view' },
  { path: '/teachers', permission: 'teachers.view' },

  { path: '/students/new', permission: 'students.create' },
  { path: '/students/:slug/edit', permission: 'students.update' },
  { path: '/students/:slug', permission: 'students.view' },
  { path: '/students', permission: 'students.view' },

  { path: '/subjects/new', permission: 'subjects.create' },
  { path: '/subjects/:slug/edit', permission: 'subjects.update' },
  { path: '/subjects/:slug', permission: 'subjects.view' },
  { path: '/subjects', permission: 'subjects.view' },

  { path: '/courses/new', permission: 'courses.create' },
  { path: '/courses/:slug/edit', permission: 'courses.update' },
  { path: '/courses/:slug', permission: 'courses.view' },
  { path: '/courses', permission: 'courses.view' },

  { path: '/enrollment-requests/:id', permission: 'enrollments.view' },
  { path: '/enrollment-requests', permission: 'enrollments.view' },

  { path: '/enrollments/course/:courseId', permission: 'enrollments.view' },
  { path: '/enrollments/new', permission: 'enrollments.create' },
  { path: '/enrollments/:id/edit', permission: 'enrollments.update' },
  { path: '/enrollments/:id', permission: 'enrollments.view' },
  { path: '/enrollments', permission: 'enrollments.view' },

  { path: '/class-sessions', permission: 'schedules.view' },

  { path: '/teacher-payouts/:id', permission: 'teachers.view' },
  { path: '/teacher-payouts', permission: 'teachers.view' },

  { path: '/monthly-closing', permission: 'monthly_close.view' },

  { path: '/articles/new', permission: 'articles.create' },
  { path: '/articles/:slug/edit', permission: 'articles.update' },
  { path: '/articles/:slug', permission: 'articles.view' },
  { path: '/articles', permission: 'articles.view' },

  { path: '/student-payments/:id/edit', permission: 'student_payments.update' },
  { path: '/student-payments/:id', permission: 'student_payments.view' },
  { path: '/student-payments', permission: 'student_payments.view' },
]

/**
 * Returns required permission slug for this pathname, or null if no guard (e.g. dashboard).
 */
export function getRequiredPermissionForPath(pathname: string): string | null {
  if (pathname === '/' || pathname === '/dashboard') {
    return null
  }
  for (const rule of ROUTE_PERMISSION_RULES) {
    if (matchPath({ path: rule.path, end: true }, pathname)) {
      return rule.permission
    }
  }
  return null
}
