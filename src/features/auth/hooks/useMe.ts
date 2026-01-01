import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser } from '../services/auth.service'
import type { ApiUser } from '../types/auth.types'

/**
 * Hook to get current authenticated user
 * Optimized: Uses cached user data from Zustand as initial data to prevent blocking on refresh
 * This allows the page to render immediately while the API call happens in the background
 */
export function useMe() {
  const token = useAuthStore((state) => state.token)
  const currentUser = useAuthStore((state) => state.user)
  const setAuth = useAuthStore((state) => state.login)

  // Create initial data from cached user if available
  // This prevents the query from blocking on refresh
  const initialData: ApiUser | undefined = currentUser && token ? {
    id: parseInt(currentUser.id),
    email: currentUser.email,
    name: currentUser.name,
    user_type: (currentUser.user_type as 'admin' | 'teacher' | 'student') || 'admin',
    profile_image: currentUser.avatar || null,
    status: 'active', // Default status
    admin: currentUser.role ? {
      id: 0, // Placeholder, will be updated by API
      admin_id: '', // Placeholder
      roles: [{ id: 0, name: currentUser.role, slug: '' }],
    } : undefined,
  } as ApiUser : undefined

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
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect (improves performance)
    // Use cached user from Zustand as initial data - this prevents blocking on refresh
    // The page will render immediately with cached data while API call happens in background
    initialData,
    // Use cached data if available while refetching (prevents blocking)
    placeholderData: (previousData) => previousData || initialData,
  })
}


