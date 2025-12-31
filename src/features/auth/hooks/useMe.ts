import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser } from '../services/auth.service'

/**
 * Hook to get current authenticated user
 * Automatically refetches user data when token is available
 */
export function useMe() {
  const token = useAuthStore((state) => state.token)
  const currentUser = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.login)

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
      
      // Only update auth store if user data actually changed to prevent unnecessary re-renders
      if (token) {
        const hasChanged = 
          !currentUser ||
          currentUser.id !== transformedUser.id ||
          currentUser.email !== transformedUser.email ||
          currentUser.name !== transformedUser.name ||
          currentUser.user_type !== transformedUser.user_type ||
          currentUser.role !== transformedUser.role ||
          currentUser.avatar !== transformedUser.avatar
        
        if (hasChanged) {
          setAuth(transformedUser, token)
        }
      }
      
      return user
    },
    enabled: !!token, // Only fetch if token exists
    retry: false, // Don't retry on 401/403
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Only refetch on reconnect
  })
}


