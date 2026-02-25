import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEnrollmentRequests,
  getEnrollmentRequestById,
  approveEnrollmentRequest,
  rejectEnrollmentRequest,
} from '../services/enrollment-request.service'
import {
  showSuccessToast,
  showErrorToast,
} from '@/utils/toast'
import type {
  ApproveEnrollmentRequestInput,
  RejectEnrollmentRequestInput,
} from '../types/enrollment-request.types'

export const enrollmentRequestKeys = {
  all: ['enrollment-requests'] as const,
  lists: () => [...enrollmentRequestKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...enrollmentRequestKeys.lists(), params] as const,
  details: () => [...enrollmentRequestKeys.all, 'detail'] as const,
  detail: (id: number) => [...enrollmentRequestKeys.details(), id] as const,
}

export function useEnrollmentRequests(params?: {
  page?: number
  per_page?: number
  status?: string
  course_id?: number
  user_id?: number
  search?: string
  created_from?: string
  created_to?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: enrollmentRequestKeys.list(params),
    queryFn: () => getEnrollmentRequests(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useEnrollmentRequest(id: number) {
  return useQuery({
    queryKey: enrollmentRequestKeys.detail(id),
    queryFn: () => getEnrollmentRequestById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export function useApproveEnrollmentRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ApproveEnrollmentRequestInput }) =>
      approveEnrollmentRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentRequestKeys.lists() })
      queryClient.refetchQueries({ queryKey: enrollmentRequestKeys.lists() })
      showSuccessToast('Enrollment request approved successfully', { title: 'Approved' })
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Approval Failed' })
    },
  })
}

export function useRejectEnrollmentRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectEnrollmentRequestInput }) =>
      rejectEnrollmentRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentRequestKeys.lists() })
      queryClient.refetchQueries({ queryKey: enrollmentRequestKeys.lists() })
      showSuccessToast('Enrollment request rejected', { title: 'Rejected' })
    },
    onError: (error: unknown) => {
      showErrorToast(error, { title: 'Rejection Failed' })
    },
  })
}
