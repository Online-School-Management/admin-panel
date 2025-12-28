import { create } from 'zustand'
import type { UIStore } from '@/types/store'

/**
 * UI store
 * Manages UI state like sidebar and mobile menu
 */
export const useUIStore = create<UIStore>()((set) => ({
  // Initial state
  sidebarOpen: true,
  mobileMenuOpen: false,

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
}))


