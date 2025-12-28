import { useAuthStore } from '@/store/authStore'

/**
 * Global auth hook for route protection
 * Uses Zustand authStore for authentication state
 */
export function useAuth() {
  const { user, token, isAuthenticated, isLoading } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  }
}

