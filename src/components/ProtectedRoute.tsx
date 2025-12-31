import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMe } from '@/features/auth/hooks/useMe'
import { AdminLayout } from '@/layouts/AdminLayout'

interface ProtectedRouteProps {
  children: React.ReactNode
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
 * ProtectedRoute component
 * Handles authentication checks and wraps children with AdminLayout
 * Uses Suspense for lazy-loaded components
 * Pattern matches example folder implementation
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuth()
  const { data: userData, isLoading: isLoadingUser, isError } = useMe()

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If token is invalid (401/403), redirect to login
  // Only redirect if we're not loading (to avoid flicker)
  if (!isLoadingUser && (isError || !isAuthenticated)) {
    return <Navigate to="/login" replace />
  }

  // Render AdminLayout with children wrapped in Suspense
  // Loading overlay is shown only during initial auth check
  return (
    <>
      <AdminLayout>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </AdminLayout>
      {/* Show loading overlay only during initial auth check */}
      {isLoadingUser && !userData && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
          </div>
        </div>
      )}
    </>
  )
}


