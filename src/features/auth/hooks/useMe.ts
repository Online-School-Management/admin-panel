import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser } from '../services/auth.service'

/**
 * Hook to get current authenticated user
 * Automatically refetches user data when token is available
 */
export function useMe() {
  const { token, login: setAuth } = useAuthStore()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await getCurrentUser()
      
      // Transform API user to frontend user format
      const transformedUser = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        role: user.admin?.roles?.[0]?.name,
        avatar: user.profile_image,
      }
      
      // Update auth store with fresh user data
      if (token) {
        setAuth(transformedUser, token)
      }
      
      return user
    },
    enabled: !!token, // Only fetch if token exists
    retry: false, // Don't retry on 401/403
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}


