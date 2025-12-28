import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'

/**
 * Global API client configuration
 * Handles base URL, request/response interceptors, and error handling
 */

// Base URL - can be moved to environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor - adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from authStore (reads from persisted state)
    // Using dynamic import to avoid circular dependency
    const authStorage = localStorage.getItem('auth-storage')
    let token: string | null = null
    
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        token = parsed.state?.token || null
      } catch {
        // Fallback to direct localStorage read
        token = localStorage.getItem('auth_token')
      }
    }
    
    // Add token to Authorization header if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - handles common errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      const status = error.response.status
      
      // Handle 401 Unauthorized - clear auth and redirect to login
      if (status === 401) {
        // Import authStore dynamically to avoid circular dependency
        import('@/store/authStore').then(({ useAuthStore }) => {
          useAuthStore.getState().logout()
        })
        // Redirect to login page
        window.location.href = '/login'
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden')
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.error('Resource not found')
      }
      
      // Handle 500 Server Error
      if (status >= 500) {
        console.error('Server error')
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

