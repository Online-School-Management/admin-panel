import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthStore, User } from '@/types/store'

/**
 * Authentication store
 * Manages user authentication state, token, and auth actions
 * Uses persist middleware to save token and user to localStorage
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: User | null) =>
        set((state) => ({
          user,
          isAuthenticated: !!user && !!state.token,
        })),

      setToken: (token: string | null) =>
        set((state) => ({
          token,
          isAuthenticated: !!token && !!state.user,
        })),

      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) =>
        set({
          isLoading,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist token and user, not loading state
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)


