import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTeacherPayouts,
  getTeacherPayoutById,
  calculatePayouts,
  markPayoutAsPaid,
  markPayoutsAsPaidBulk,
} from '../services/teacher-payout.service'
import {
  showSuccessToast,
  showErrorToast,
} from '@/utils/toast'
import type {
  CalculatePayoutInput,
  MarkAsPaidBulkInput,
} from '../types/teacher-payout.types'

/**
 * Query keys for teacher payout-related queries
 */
export const teacherPayoutKeys = {
  all: ['teacher-payouts'] as const,
  lists: () => [...teacherPayoutKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...teacherPayoutKeys.lists(), params] as const,
  details: () => [...teacherPayoutKeys.all, 'detail'] as const,
  detail: (id: number) => [...teacherPayoutKeys.details(), id] as const,
}

/**
 * Hook to fetch all teacher payouts with filters and pagination
 */
export function useTeacherPayouts(params?: {
  page?: number
  per_page?: number
  teacher_id?: number
  course_id?: number
  commission_type?: string
  status?: string
  payout_month?: string
  period_start?: string
  period_end?: string
  search?: string
  order_by?: string
  order_dir?: string
}) {
  return useQuery({
    queryKey: teacherPayoutKeys.list(params),
    queryFn: () => getTeacherPayouts(params),
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * Hook to fetch a single teacher payout by ID
 */
export function useTeacherPayout(id: number) {
  return useQuery({
    queryKey: teacherPayoutKeys.detail(id),
    queryFn: () => getTeacherPayoutById(id),
    enabled: !!id,
  })
}

/**
 * Hook to calculate payouts for a period
 */
export function useCalculatePayouts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CalculatePayoutInput) => calculatePayouts(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: teacherPayoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: teacherPayoutKeys.lists() })
      showSuccessToast(
        `${response.data.created_count} payouts calculated. Total: ${Number(response.data.total_amount).toLocaleString()} MMK`,
        { title: 'Payouts Calculated' }
      )
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Calculation Failed' })
    },
  })
}

/**
 * Hook to mark a single payout as paid
 */
export function useMarkPayoutAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => markPayoutAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherPayoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: teacherPayoutKeys.lists() })
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
    mutationFn: (data: MarkAsPaidBulkInput) => markPayoutsAsPaidBulk(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: teacherPayoutKeys.lists() })
      queryClient.refetchQueries({ queryKey: teacherPayoutKeys.lists() })
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
