/**
 * Authentication types
 */

export interface LoginCredentials {
  email: string
  password: string
}

/**
 * API Response structure from backend
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

/**
 * User data from API
 */
export interface ApiUser {
  id: number
  name: string
  email: string
  user_type: 'admin' | 'teacher' | 'student'
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  profile_image?: string
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string
  last_login_at?: string
  admin?: {
    id: number
    admin_id: string
    roles?: Array<{
      id: number
      name: string
      slug: string
    }>
    permissions?: Array<{
      id: number
      name: string
      slug: string
      module: string
    }>
  }
  created_at?: string
  updated_at?: string
}

/**
 * Login API response data
 */
export interface LoginResponseData {
  user: ApiUser
  token: string
  token_type: string
}

/**
 * Transformed login response for frontend
 */
export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    user_type: 'admin' | 'teacher' | 'student'
    role?: string
    avatar?: string
    [key: string]: unknown
  }
  token: string
}

export interface AuthError {
  message: string
  field?: string
}


