import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../services/course.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateCourseInput,
  UpdateCourseInput,
} from '../types/course.types'

/**
 * Query keys for course-related queries
 */
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (slug: string) => [...courseKeys.details(), slug] as const,
}

/**
 * Hook to fetch all courses with filters and pagination
 */
export function useCourses(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  status?: string
  subject_id?: number
}) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourses(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single course by slug
 */
export function useCourse(slug: string) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to create a new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateCourseInput) => createCourse(data),
    onSuccess: (response) => {
      // Invalidate all course list queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      showCreateSuccessToast('course', `${response.data.title} has been added`)
      navigate('/courses')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('course', error)
    },
  })
}

/**
 * Hook to update an existing course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateCourseInput }) =>
      updateCourse(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.slug) })
      queryClient.refetchQueries({ queryKey: courseKeys.detail(variables.slug) })
      showUpdateSuccessToast('course', `${response.data.title} has been updated`)
      navigate('/courses')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('course', error)
    },
  })
}

/**
 * Hook to delete a course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteCourse(slug),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted course is removed
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      showDeleteSuccessToast('course')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('course', error)
    },
  })
}



