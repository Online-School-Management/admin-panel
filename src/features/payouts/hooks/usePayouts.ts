import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPayouts,
  getPayoutById,
  markPayoutAsPaid,
  markPayoutsAsPaidBulk,
} from '../services/payout.service'
import {
  showSuccessToast,
  showErrorToast,
} from '@/utils/toast'
import type {
  MarkPayoutsPaidBulkInput,
} from '../types/payout.types'

// Teacher payout query key (inline to avoid circular dependency)
const TEACHER_PAYOUTS_LIST_KEY = ['teacher-payouts', 'list'] as const

/**
 * Query keys for payout-related queries
 */
export const payoutKeys = {
  all: ['payouts'] as const,
  lists: () => [...payoutKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...payoutKeys.lists(), params] as const,
  details: () => [...payoutKeys.all, 'detail'] as const,
  detail: (id: number) => [...payoutKeys.details(), id] as const,
}

/**
 * Hook to fetch all payouts with filters and pagination
 */
export function usePayouts(params?: {
  page?: number
  per_page?: number
  recipient_type?: string
  recipient_id?: number
  status?: string
  payout_month?: string
  period_start?: string
  period_end?: string
  search?: string
  order_by?: string
  order_dir?: string
}) {
  return useQuery({
    queryKey: payoutKeys.list(params),
    queryFn: () => getPayouts(params),
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * Hook to fetch a single payout by ID (with detail)
 */
export function usePayout(id: number) {
  return useQuery({
    queryKey: payoutKeys.detail(id),
    queryFn: () => getPayoutById(id),
    enabled: !!id,
  })
}

/**
 * Hook to mark a single payout as paid (one click)
 */
export function useMarkPayoutAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => markPayoutAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: payoutKeys.lists() })
      // Also invalidate teacher-payouts since they get synced
      queryClient.invalidateQueries({ queryKey: TEACHER_PAYOUTS_LIST_KEY })
      showSuccessToast('Payout marked as paid', { title: 'Paid' })
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Failed to mark as paid' })
    },
  })
}

/**
 * Hook to mark multiple payouts as paid (bulk)
 */
export function useMarkPayoutsAsPaidBulk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MarkPayoutsPaidBulkInput) => markPayoutsAsPaidBulk(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: payoutKeys.lists() })
      queryClient.invalidateQueries({ queryKey: TEACHER_PAYOUTS_LIST_KEY })
      showSuccessToast(
        `${response.data.updated_count} payouts marked as paid`,
        { title: 'Bulk Update' }
      )
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Bulk update failed' })
    },
  })
}
