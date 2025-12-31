import { toast } from '@/hooks/use-toast'

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
 */
export function showErrorToast(message: string, options?: ToastOptions) {
  toast({
    title: options?.title || 'Error',
    description: message || options?.description || 'Something went wrong',
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
 */
export function showCreateErrorToast(itemName: string, error?: Error | string) {
  const errorMessage = typeof error === 'string' ? error : error?.message
  showErrorToast(
    errorMessage || `Failed to create ${itemName.toLowerCase()}`,
    {
      title: 'Create Failed',
      description: errorMessage || `Something went wrong while creating the ${itemName.toLowerCase()}.`,
    }
  )
}

/**
 * Show an error toast for update operations
 */
export function showUpdateErrorToast(itemName: string, error?: Error | string) {
  const errorMessage = typeof error === 'string' ? error : error?.message
  showErrorToast(
    errorMessage || `Failed to update ${itemName.toLowerCase()}`,
    {
      title: 'Update Failed',
      description: errorMessage || `Something went wrong while updating the ${itemName.toLowerCase()}.`,
    }
  )
}

/**
 * Show an error toast for delete operations
 */
export function showDeleteErrorToast(itemName: string, error?: Error | string) {
  const errorMessage = typeof error === 'string' ? error : error?.message
  showErrorToast(
    errorMessage || `Failed to delete ${itemName.toLowerCase()}`,
    {
      title: 'Delete Failed',
      description: errorMessage || `Something went wrong while deleting the ${itemName.toLowerCase()}.`,
    }
  )
}

