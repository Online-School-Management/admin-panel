import { QueryClient } from '@tanstack/react-query'

/**
 * QueryClient configuration for TanStack Query
 * Provides default options for all queries and mutations
 */
/**
 * QueryClient configuration for TanStack Query
 * Optimized for performance with better caching and reduced refetches
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // Time before inactive queries are garbage collected (10 minutes)
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 2 times (reduced from 3 for faster failure)
      retry: 2,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus (improves performance)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data exists (improves performance)
      refetchOnMount: false,
      // Use cached data as placeholder while refetching
      placeholderData: (previousData: unknown) => previousData,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay
      retryDelay: 1000,
    },
  },
})


