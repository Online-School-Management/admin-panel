import { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

/**
 * Extract error message from API error response
 * Handles Laravel validation errors and standard API error messages
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiError | any
    
    // Check for validation errors (Laravel format: { errors: { field: [messages] } })
    if (responseData?.errors && typeof responseData.errors === 'object') {
      const errors = responseData.errors
      // Get first validation error message
      const firstErrorKey = Object.keys(errors)[0]
      if (firstErrorKey) {
        const firstError = errors[firstErrorKey]
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0]
        }
        if (typeof firstError === 'string') {
          return firstError
        }
      }
    }
    
    // Check for direct message property
    if (responseData?.message) {
      return responseData.message
    }
    
    // Check for error property (some APIs use this)
    if (responseData?.error) {
      return typeof responseData.error === 'string' 
        ? responseData.error 
        : responseData.error.message || 'An error occurred'
    }
    
    // Fallback to Axios error message
    if (error.message) {
      return error.message
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

/**
 * Extract validation errors from API error response
 */
export function getApiValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined
    return apiError?.errors || null
  }
  
  return null
}


