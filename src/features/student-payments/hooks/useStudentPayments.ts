import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getStudentPayments,
  getStudentPaymentById,
  getStudentPaymentsByEnrollment,
  updateStudentPayment,
  deleteStudentPayment,
} from '../services/student-payment.service'
import {
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  UpdateStudentPaymentInput,
} from '../types/student-payment.types'

/**
 * Query keys for student payment-related queries
 */
export const studentPaymentKeys = {
  all: ['student-payments'] as const,
  lists: () => [...studentPaymentKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...studentPaymentKeys.lists(), params] as const,
  details: () => [...studentPaymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...studentPaymentKeys.details(), id] as const,
  byEnrollment: (enrollmentId: number) => [...studentPaymentKeys.all, 'enrollment', enrollmentId] as const,
}

/**
 * Hook to fetch all student payments with filters and pagination
 */
export function useStudentPayments(params?: {
  page?: number
  per_page?: number
  enrollment_id?: number
  student_id?: number
  course_id?: number
  status?: string
  search?: string
  order_by?: string
  order_dir?: string
  month?: number
  year?: number
}) {
  return useQuery({
    queryKey: studentPaymentKeys.list(params),
    queryFn: () => getStudentPayments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single student payment by ID
 */
export function useStudentPayment(id: number) {
  return useQuery({
    queryKey: studentPaymentKeys.detail(id),
    queryFn: () => getStudentPaymentById(id),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to fetch student payments by enrollment ID
 */
export function useStudentPaymentsByEnrollment(enrollmentId: number) {
  return useQuery({
    queryKey: studentPaymentKeys.byEnrollment(enrollmentId),
    queryFn: () => getStudentPaymentsByEnrollment(enrollmentId),
    enabled: !!enrollmentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to update an existing student payment
 */
export function useUpdateStudentPayment() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentPaymentInput }) =>
      updateStudentPayment(id, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: studentPaymentKeys.lists() })
      queryClient.refetchQueries({ queryKey: studentPaymentKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: studentPaymentKeys.detail(variables.id) })
      queryClient.refetchQueries({ queryKey: studentPaymentKeys.detail(variables.id) })
      // Invalidate enrollment payments if enrollment_id is available
      if (response.data.enrollment_id) {
        queryClient.invalidateQueries({ queryKey: studentPaymentKeys.byEnrollment(response.data.enrollment_id) })
        queryClient.refetchQueries({ queryKey: studentPaymentKeys.byEnrollment(response.data.enrollment_id) })
      }
      showUpdateSuccessToast('student payment', 'Payment has been updated')
      navigate('/student-payments')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('student payment', error)
    },
  })
}

/**
 * Hook to delete a student payment
 */
export function useDeleteStudentPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStudentPayment(id),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted payment is removed
      queryClient.invalidateQueries({ queryKey: studentPaymentKeys.lists() })
      queryClient.refetchQueries({ queryKey: studentPaymentKeys.lists() })
      showDeleteSuccessToast('student payment')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('student payment', error)
    },
  })
}

/**
 * Hook to mark a payment as paid (without navigation)
 * Used for quick actions in list views
 */
export function useMarkAsPaidPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentPaymentInput }) =>
      updateStudentPayment(id, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: studentPaymentKeys.lists() })
      queryClient.refetchQueries({ queryKey: studentPaymentKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: studentPaymentKeys.detail(variables.id) })
      queryClient.refetchQueries({ queryKey: studentPaymentKeys.detail(variables.id) })
      // Invalidate enrollment payments if enrollment_id is available
      if (response.data.enrollment_id) {
        queryClient.invalidateQueries({ queryKey: studentPaymentKeys.byEnrollment(response.data.enrollment_id) })
        queryClient.refetchQueries({ queryKey: studentPaymentKeys.byEnrollment(response.data.enrollment_id) })
      }
      showUpdateSuccessToast('student payment', 'Payment has been marked as paid')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('student payment', error)
    },
  })
}


