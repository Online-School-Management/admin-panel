import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMe } from '@/features/auth/hooks/useMe'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuth()
  const { isLoading: isLoadingUser, isError } = useMe()

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If we have a token, verify it by fetching user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If token is invalid (401/403), redirect to login
  if (isError || !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}


