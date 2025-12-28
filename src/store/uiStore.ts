import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UIStore } from '@/types/store'

/**
 * UI store
 * Manages UI state like sidebar, mobile menu, and theme
 * Uses persist middleware to save theme preference to localStorage
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'light',

      // Actions
      setSidebarOpen: (open: boolean) =>
        set({
          sidebarOpen: open,
        }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setMobileMenuOpen: (open: boolean) =>
        set({
          mobileMenuOpen: open,
        }),

      toggleMobileMenu: () =>
        set((state) => ({
          mobileMenuOpen: !state.mobileMenuOpen,
        })),

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
        // Apply theme to document root
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          // Apply theme to document root
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { theme: newTheme }
        }),
    }),
    {
      name: 'ui-storage', // localStorage key
      partialize: (state) => ({
        // Only persist theme preference
        theme: state.theme,
      }),
    }
  )
)


