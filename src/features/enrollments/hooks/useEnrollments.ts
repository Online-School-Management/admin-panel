import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from '../services/enrollment.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from '../types/enrollment.types'

/**
 * Query keys for enrollment-related queries
 */
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  lists: () => [...enrollmentKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...enrollmentKeys.lists(), params] as const,
  details: () => [...enrollmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...enrollmentKeys.details(), id] as const,
  byStudent: (studentId: number) => [...enrollmentKeys.all, 'student', studentId] as const,
  byCourse: (courseId: number) => [...enrollmentKeys.all, 'course', courseId] as const,
}

/**
 * Hook to fetch all enrollments with filters and pagination
 */
export function useEnrollments(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  student_id?: number
  course_id?: number
  status?: string
  enrolled_from?: string
  enrolled_to?: string
}) {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: () => getEnrollments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single enrollment by ID
 */
export function useEnrollment(id: number) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: () => getEnrollmentById(id),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to fetch enrollments by student ID
 */
export function useEnrollmentsByStudent(studentId: number) {
  return useQuery({
    queryKey: enrollmentKeys.byStudent(studentId),
    queryFn: () => getEnrollmentsByStudent(studentId),
    enabled: !!studentId,
    staleTime: 0, // Always fetch fresh data
  })
}

/**
 * Hook to fetch enrollments by course ID
 */
export function useEnrollmentsByCourse(courseId: number) {
  return useQuery({
    queryKey: enrollmentKeys.byCourse(courseId),
    queryFn: () => getEnrollmentsByCourse(courseId),
    enabled: !!courseId,
    staleTime: 0, // Always fetch fresh data
  })
}

/**
 * Hook to create a new enrollment
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateEnrollmentInput) => createEnrollment(data),
    onSuccess: () => {
      // Invalidate all enrollment list queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() })
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: enrollmentKeys.lists() })
      showCreateSuccessToast('enrollment', 'Enrollment created successfully')
      navigate('/enrollments')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('enrollment', error)
    },
  })
}

/**
 * Hook to update an existing enrollment
 */
export function useUpdateEnrollment() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEnrollmentInput }) =>
      updateEnrollment(id, data),
    onSuccess: (_response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() })
      queryClient.refetchQueries({ queryKey: enrollmentKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(variables.id) })
      queryClient.refetchQueries({ queryKey: enrollmentKeys.detail(variables.id) })
      showUpdateSuccessToast('enrollment', 'Enrollment updated successfully')
      navigate('/enrollments')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('enrollment', error)
    },
  })
}

/**
 * Hook to delete an enrollment
 */
export function useDeleteEnrollment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteEnrollment(id),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted enrollment is removed
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() })
      queryClient.refetchQueries({ queryKey: enrollmentKeys.lists() })
      showDeleteSuccessToast('enrollment')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('enrollment', error)
    },
  })
}

