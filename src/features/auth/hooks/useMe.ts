import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/store'
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
  const cached = currentUser && token ? (currentUser as User) : null
  const initialData: ApiUser | undefined = cached
    ? {
        id: parseInt(cached.id, 10),
        email: cached.email,
        name: cached.name,
        user_type: (cached.user_type as 'admin' | 'teacher' | 'student') || 'admin',
        profile_image: cached.avatar || undefined,
        status: 'active',
        admin: cached.role || (cached.role_slugs && cached.role_slugs.length > 0)
          ? {
              id: 0,
              admin_id: '',
              roles:
                cached.role_slugs && cached.role_slugs.length > 0
                  ? cached.role_slugs.map((slug, idx) => ({
                      id: idx,
                      name: cached.role ?? '',
                      slug,
                    }))
                  : [{ id: 0, name: cached.role ?? '', slug: '' }],
            }
          : undefined,
      }
    : undefined

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
        role_slugs: user.admin?.roles?.map((r) => r.slug) ?? [],
        avatar: user.profile_image,
      }
      
      // Only update auth store if user data actually changed to prevent unnecessary re-renders
      if (token) {
        const prevSlugs = (currentUser as User | null)?.role_slugs?.join(',') ?? ''
        const nextSlugs = transformedUser.role_slugs?.join(',') ?? ''
        const hasChanged = 
          !currentUser ||
          currentUser.id !== transformedUser.id ||
          currentUser.email !== transformedUser.email ||
          currentUser.name !== transformedUser.name ||
          currentUser.user_type !== transformedUser.user_type ||
          currentUser.role !== transformedUser.role ||
          currentUser.avatar !== transformedUser.avatar ||
          prevSlugs !== nextSlugs
        
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
    // Zustand cache never includes admin.permissions; must hit /auth/me once. Treat stub as stale
    // so we refetch on mount; after that, React Query cache has full user for route guards / sidebar.
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect (improves performance)
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
    // Use cached data if available while refetching (prevents blocking)
    placeholderData: (previousData) => previousData || initialData,
  })
}


