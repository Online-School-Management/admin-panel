import { useAuthStore } from '@/store/authStore'

/**
 * Global auth hook for route protection
 * Uses Zustand authStore for authentication state
 * Uses selective subscriptions to prevent unnecessary re-renders
 */
export function useAuth() {
  // Use selective subscriptions - only re-render when these specific values change
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  }
}

