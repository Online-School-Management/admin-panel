import { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

/**
 * Extract error message from API error response
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined
    
    if (apiError?.message) {
      return apiError.message
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error.message) {
      return error.message
    }
  }
  
  if (error instanceof Error) {
    return error.message
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


