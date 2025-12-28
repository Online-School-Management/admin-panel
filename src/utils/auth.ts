/**
 * Authentication utilities
 * Helper functions for token validation and auth operations
 */

/**
 * Validate token format (basic validation)
 * In a real app, this would decode and verify JWT token
 */
export function isValidToken(token: string | null): boolean {
  if (!token) return false
  
  // Basic validation - check if token exists and has minimum length
  // TODO: Replace with actual JWT validation when backend is ready
  return token.length > 10
}

/**
 * Get token expiration (if token contains expiration info)
 * TODO: Implement JWT decoding when backend is ready
 */
export function getTokenExpiration(token: string | null): Date | null {
  if (!token) return null
  
  // TODO: Decode JWT and extract expiration
  // For now, return null (static tokens don't expire)
  return null
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string | null): boolean {
  const expiration = getTokenExpiration(token)
  if (!expiration) return false
  
  return expiration < new Date()
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem('auth-storage')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}


