/**
 * Global API types and interfaces
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

/**
 * API error response
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}


