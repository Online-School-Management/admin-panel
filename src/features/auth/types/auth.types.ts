/**
 * Authentication types
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role?: string
    avatar?: string
  }
  token: string
}

export interface AuthError {
  message: string
  field?: string
}


