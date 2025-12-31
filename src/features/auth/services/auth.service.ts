import apiClient from '@/services/api-client'
import type {
  LoginCredentials,
  LoginResponse,
  ApiResponse,
  LoginResponseData,
  ApiUser,
} from '../types/auth.types'

/**
 * Authentication service
 * Handles all authentication-related API calls
 */

/**
 * Login function - Calls real API
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed')
    }

    const { user, token } = response.data.data

    // Transform API user to frontend user format
    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        role: user.admin?.roles?.[0]?.name,
        avatar: user.profile_image,
      },
      token,
    }
  } catch (error: any) {
    // Handle API errors
    if (error.response?.data) {
      const apiError = error.response.data
      if (apiError.errors) {
        // Validation errors
        const firstError = Object.values(apiError.errors)[0]
        throw new Error(
          Array.isArray(firstError) ? firstError[0] : firstError || 'Login failed'
        )
      }
      throw new Error(apiError.message || 'Login failed')
    }
    throw new Error(error.message || 'Login failed')
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<ApiUser> {
  try {
    const response = await apiClient.get<ApiResponse<ApiUser>>('/auth/me')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get user')
    }

    return response.data.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.message || 'Failed to get user')
    }
    throw new Error(error.message || 'Failed to get user')
  }
}

/**
 * Logout function - Calls API to revoke token
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post<ApiResponse<null>>('/auth/logout')
  } catch (error: any) {
    // Even if logout fails on server, we should still clear local state
    // Log error but don't throw
    console.error('Logout error:', error)
  }
}


