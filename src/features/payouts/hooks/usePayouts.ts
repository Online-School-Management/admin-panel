import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPayouts,
  getPayoutById,
  markPayoutAsPaid,
  markPayoutsAsPaidBulk,
  getMonthlyClosingSummary,
  createPayout,
  updatePayoutBonus,
} from '../services/payout.service'
import {
  showSuccessToast,
  showErrorToast,
  showCreateSuccessToast,
  showCreateErrorToast,
} from '@/utils/toast'
import type {
  MarkPayoutsPaidBulkInput,
  CreatePayoutInput,
  UpdatePayoutBonusInput,
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
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: payoutKeys.lists() })
      queryClient.invalidateQueries({ queryKey: payoutKeys.detail(id) })
      queryClient.refetchQueries({ queryKey: payoutKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: TEACHER_PAYOUTS_LIST_KEY })
      queryClient.invalidateQueries({ queryKey: MONTHLY_CLOSING_SUMMARY_KEY })
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
      queryClient.invalidateQueries({ queryKey: MONTHLY_CLOSING_SUMMARY_KEY })
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

const MONTHLY_CLOSING_SUMMARY_KEY = ['payouts', 'monthly-closing-summary'] as const

/**
 * Hook to fetch monthly closing summary for a period
 */
export function useMonthlyClosingSummary(periodStart: string, periodEnd: string) {
  return useQuery({
    queryKey: [...MONTHLY_CLOSING_SUMMARY_KEY, periodStart, periodEnd],
    queryFn: () => getMonthlyClosingSummary(periodStart, periodEnd),
    enabled: !!periodStart && !!periodEnd,
    staleTime: 1000 * 60,
  })
}

/**
 * Hook to create a payout (non-teacher types)
 */
export function useCreatePayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePayoutInput) => createPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.lists() })
      queryClient.invalidateQueries({ queryKey: MONTHLY_CLOSING_SUMMARY_KEY })
      showCreateSuccessToast('Payout')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('Payout', error)
    },
  })
}

/**
 * Hook to update payout bonus (only for pending payouts)
 */
export function useUpdatePayoutBonus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePayoutBonusInput }) =>
      updatePayoutBonus(id, data),
    onSuccess: (_data) => {
      const id = _data?.data?.id
      if (id) {
        queryClient.invalidateQueries({ queryKey: payoutKeys.detail(id) })
        queryClient.invalidateQueries({ queryKey: payoutKeys.lists() })
        queryClient.invalidateQueries({ queryKey: TEACHER_PAYOUTS_LIST_KEY })
        queryClient.invalidateQueries({ queryKey: MONTHLY_CLOSING_SUMMARY_KEY })
      }
      showSuccessToast('Bonus updated', { title: 'Updated' })
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Failed to update bonus' })
    },
  })
}
