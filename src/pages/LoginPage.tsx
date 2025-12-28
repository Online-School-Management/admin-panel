import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

/**
 * Login Page
 * Authentication page with login form
 */
function LoginPage() {
  const { isAuthenticated } = useAuth()

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage

