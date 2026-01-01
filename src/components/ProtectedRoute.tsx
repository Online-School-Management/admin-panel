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
 * Optimized: Don't block page render waiting for user data
 * This allows page content to load in parallel with user data fetch
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth()
  const { data: userData, isLoading: isLoadingUser, isError } = useMe()

  // If no token, redirect to login immediately
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Render page immediately - don't wait for user data
  // User data will load in background and update when ready
  // Only redirect if we get an error (not while loading)
  if (!isLoadingUser && isError && !userData) {
    return <Navigate to="/login" replace />
  }

  // Render AdminLayout with children immediately
  // This allows page content to load in parallel with user data
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AdminLayout>
  )
}


