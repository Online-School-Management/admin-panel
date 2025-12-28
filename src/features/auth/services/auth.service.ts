import type { LoginCredentials, LoginResponse } from '../types/auth.types'

/**
 * Authentication service
 * Currently uses static authentication (will be replaced with API calls later)
 */

// Static admin credentials
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin' // Default password

/**
 * Login function - Static implementation
 * TODO: Replace with actual API call when backend is ready
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Static authentication check
  if (
    credentials.email === ADMIN_EMAIL &&
    credentials.password === ADMIN_PASSWORD
  ) {
    return {
      user: {
        id: '1',
        email: ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin',
      },
      token: 'static-auth-token-' + Date.now(), // Generate a simple token
    }
  }

  // Throw error for invalid credentials
  throw new Error('Invalid email or password')
}

/**
 * Logout function
 * TODO: Replace with actual API call when backend is ready
 */
export async function logout(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  // In real implementation, this would call the API to invalidate the token
}


