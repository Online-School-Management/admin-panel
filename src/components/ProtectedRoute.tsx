import { Suspense } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMe } from '@/features/auth/hooks/useMe'
import { AdminLayout } from '@/layouts/AdminLayout'
import { getRequiredPermissionForPath } from '@/constants/routePermissions'
import { isSuperAdmin } from '@/utils/isSuperAdmin'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Skip pathname permission check (e.g. /unauthorized). */
  bypassRoutePermission?: boolean
}

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

/**
 * ProtectedRoute: auth, optional route-level permission check (aligned with sidebar + API slugs),
 * and AdminLayout + Suspense for lazy pages.
 */
export function ProtectedRoute({ children, bypassRoutePermission = false }: ProtectedRouteProps) {
  const { token } = useAuth()
  const location = useLocation()
  const { data: userData, isLoading: isLoadingUser, isFetching, isError } = useMe()

  const requiredPermission = bypassRoutePermission
    ? null
    : getRequiredPermissionForPath(location.pathname)

  // If no token, redirect to login immediately
  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isLoadingUser && isError && !userData) {
    return <Navigate to="/login" replace />
  }

  const isAdmin = userData?.user_type === 'admin'
  const superAdmin = isSuperAdmin(userData)
  const adminPerms = userData?.admin?.permissions
  /** Stub /me from cache omits permissions; wait for API before enforcing route access. */
  const waitingForPermissionList =
    Boolean(
      !superAdmin &&
        requiredPermission &&
        token &&
        isAdmin &&
        userData?.admin &&
        !Array.isArray(adminPerms)
    )

  if (waitingForPermissionList && (isLoadingUser || isFetching)) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    )
  }

  if (
    requiredPermission &&
    isAdmin &&
    !superAdmin &&
    userData?.admin &&
    Array.isArray(adminPerms)
  ) {
    if (adminPerms.length > 0 && !adminPerms.some((p) => p.slug === requiredPermission)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  if (waitingForPermissionList) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AdminLayout>
  )
}


