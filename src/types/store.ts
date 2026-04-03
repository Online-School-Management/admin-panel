/**
 * Store type definitions for Zustand stores
 */

/**
 * User type for authentication
 */
export interface User {
  id: string
  email: string
  name: string
  role?: string
  /** Active role slugs from login /me (for super_admin detection before permissions load). */
  role_slugs?: string[]
  avatar?: string
  user_type?: string
  [key: string]: unknown // Allow additional user properties
}

/**
 * Auth store state
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

/**
 * Auth store actions
 */
export interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
}

/**
 * Combined auth store type
 */
export type AuthStore = AuthState & AuthActions

/**
 * UI store state
 */
export interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
}

/**
 * UI store actions
 */
export interface UIActions {
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

/**
 * Combined UI store type
 */
export type UIStore = UIState & UIActions


