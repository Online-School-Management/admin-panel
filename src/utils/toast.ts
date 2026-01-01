import { toast } from '@/hooks/use-toast'
import { getApiErrorMessage } from './api-error'

/**
 * Toast utility functions for consistent success and error messages
 * Provides reusable helpers for common toast notifications
 */

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

/**
 * Show a success toast notification
 */
export function showSuccessToast(message: string, options?: ToastOptions) {
  toast({
    title: options?.title || 'Success',
    description: message || options?.description,
    variant: 'success',
    duration: options?.duration,
  })
}

/**
 * Show an error toast notification
 * Can accept Error object and extract API error message
 */
export function showErrorToast(message: string | Error | unknown, options?: ToastOptions) {
  const errorMessage = typeof message === 'string' 
    ? message 
    : message instanceof Error 
      ? getApiErrorMessage(message)
      : message 
        ? getApiErrorMessage(message)
        : 'Something went wrong'
  
  toast({
    title: options?.title || 'Error',
    description: errorMessage || options?.description || 'Something went wrong',
    variant: 'destructive',
    duration: options?.duration,
  })
}

/**
 * Show a success toast for create operations
 */
export function showCreateSuccessToast(itemName: string, itemLabel?: string) {
  showSuccessToast(
    itemLabel || `${itemName} created successfully`,
    {
      title: 'Created',
      description: itemLabel || `The ${itemName.toLowerCase()} has been added successfully.`,
    }
  )
}

/**
 * Show a success toast for update operations
 */
export function showUpdateSuccessToast(itemName: string, itemLabel?: string) {
  showSuccessToast(
    itemLabel || `${itemName} updated successfully`,
    {
      title: 'Updated',
      description: itemLabel || `The ${itemName.toLowerCase()} has been updated successfully.`,
    }
  )
}

/**
 * Show a success toast for delete operations
 */
export function showDeleteSuccessToast(itemName: string, itemLabel?: string) {
  showSuccessToast(
    itemLabel || `${itemName} deleted successfully`,
    {
      title: 'Deleted',
      description: itemLabel || `The ${itemName.toLowerCase()} has been deleted successfully.`,
    }
  )
}

/**
 * Show an error toast for create operations
 * Extracts error message from API response
 */
export function showCreateErrorToast(itemName: string, error?: Error | string | unknown) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? getApiErrorMessage(error)
      : error 
        ? getApiErrorMessage(error)
        : `Failed to create ${itemName.toLowerCase()}`
  
  showErrorToast(
    errorMessage,
    {
      title: 'Create Failed',
      description: errorMessage,
    }
  )
}

/**
 * Show an error toast for update operations
 * Extracts error message from API response
 */
export function showUpdateErrorToast(itemName: string, error?: Error | string | unknown) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? getApiErrorMessage(error)
      : error 
        ? getApiErrorMessage(error)
        : `Failed to update ${itemName.toLowerCase()}`
  
  showErrorToast(
    errorMessage,
    {
      title: 'Update Failed',
      description: errorMessage,
    }
  )
}

/**
 * Show an error toast for delete operations
 * Extracts error message from API response
 */
export function showDeleteErrorToast(itemName: string, error?: Error | string | unknown) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? getApiErrorMessage(error)
      : error 
        ? getApiErrorMessage(error)
        : `Failed to delete ${itemName.toLowerCase()}`
  
  showErrorToast(
    errorMessage,
    {
      title: 'Delete Failed',
      description: errorMessage,
    }
  )
}

