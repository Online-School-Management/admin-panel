import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getTeachers,
  getTeacherBySlug,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../services/teacher.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateTeacherInput,
  UpdateTeacherInput,
} from '../types/teacher.types'

/**
 * Query keys for teacher-related queries
 */
export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (slug: string) => [...teacherKeys.details(), slug] as const,
}

/**
 * Hook to fetch all teachers with filters and pagination
 */
export function useTeachers(params?: {
  page?: number
  per_page?: number
  status?: string
  department?: string
  employment_type?: string
  search?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: teacherKeys.list(params),
    queryFn: () => getTeachers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single teacher by slug
 */
export function useTeacher(slug: string) {
  return useQuery({
    queryKey: teacherKeys.detail(slug),
    queryFn: () => getTeacherBySlug(slug),
    enabled: !!slug,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to create a new teacher
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateTeacherInput) => createTeacher(data),
    onSuccess: (response) => {
      // Invalidate all teacher list queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: teacherKeys.lists() })
      showCreateSuccessToast('teacher', `${response.data.user.name} has been added`)
      navigate('/teachers')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('teacher', error)
    },
  })
}

/**
 * Hook to update an existing teacher
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateTeacherInput }) =>
      updateTeacher(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
      queryClient.refetchQueries({ queryKey: teacherKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(variables.slug) })
      queryClient.refetchQueries({ queryKey: teacherKeys.detail(variables.slug) })
      showUpdateSuccessToast('teacher', `${response.data.user.name} has been updated`)
      navigate('/teachers')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('teacher', error)
    },
  })
}

/**
 * Hook to delete a teacher
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteTeacher(slug),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted teacher is removed
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
      queryClient.refetchQueries({ queryKey: teacherKeys.lists() })
      showDeleteSuccessToast('teacher')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('teacher', error)
    },
  })
}

