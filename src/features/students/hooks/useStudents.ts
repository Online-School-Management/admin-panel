import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getStudents,
  getStudentBySlug,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/student.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateStudentInput,
  UpdateStudentInput,
} from '../types/student.types'

/**
 * Query keys for student-related queries
 */
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (slug: string) => [...studentKeys.details(), slug] as const,
}

/**
 * Hook to fetch all students with filters and pagination
 */
export function useStudents(params?: {
  page?: number
  per_page?: number
  status?: string
  search?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => getStudents(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single student by slug
 */
export function useStudent(slug: string) {
  return useQuery({
    queryKey: studentKeys.detail(slug),
    queryFn: () => getStudentBySlug(slug),
    enabled: !!slug,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateStudentInput) => createStudent(data),
    onSuccess: (response) => {
      // Invalidate all student list queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: studentKeys.lists() })
      showCreateSuccessToast('student', `${response.data.user.name} has been added`)
      navigate('/students')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('student', error)
    },
  })
}

/**
 * Hook to update an existing student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateStudentInput }) =>
      updateStudent(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      queryClient.refetchQueries({ queryKey: studentKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.slug) })
      queryClient.refetchQueries({ queryKey: studentKeys.detail(variables.slug) })
      showUpdateSuccessToast('student', `${response.data.user.name} has been updated`)
      navigate('/students')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('student', error)
    },
  })
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteStudent(slug),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted student is removed
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
      queryClient.refetchQueries({ queryKey: studentKeys.lists() })
      showDeleteSuccessToast('student')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('student', error)
    },
  })
}



