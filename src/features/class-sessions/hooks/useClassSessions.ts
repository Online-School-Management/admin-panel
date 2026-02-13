import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getClassSessionsByDate,
  getClassSession,
  createClassSession,
  updateClassSession,
  deleteClassSession,
} from '../services/class-session.service'
import type { CreateClassSessionInput, UpdateClassSessionInput } from '../types/class-session.types'
import { showCreateSuccessToast, showUpdateSuccessToast, showDeleteSuccessToast, showCreateErrorToast, showUpdateErrorToast, showDeleteErrorToast } from '@/utils/toast'
import { courseKeys } from '@/features/courses/hooks/useCourses'

/**
 * Query keys for class-session queries
 */
export const classSessionKeys = {
  all: ['class-sessions'] as const,
  byDate: (date: string) => [...classSessionKeys.all, 'date', date] as const,
  detail: (id: number) => [...classSessionKeys.all, 'detail', id] as const,
}

/**
 * Hook to fetch class sessions for a specific date
 * @param date YYYY-MM-DD string
 */
export function useClassSessionsByDate(date: string) {
  return useQuery({
    queryKey: classSessionKeys.byDate(date),
    queryFn: () => getClassSessionsByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single class session (for edit form)
 */
export function useClassSession(id: number | null) {
  return useQuery({
    queryKey: classSessionKeys.detail(id ?? 0),
    queryFn: () => getClassSession(id as number),
    enabled: id != null && id > 0,
    staleTime: 0,
  })
}

/**
 * Hook to create a class session manually
 * @param courseSlug - optional; when provided, invalidates course detail so class_sessions list refreshes
 */
export function useCreateClassSession(courseSlug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClassSessionInput) => createClassSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSessionKeys.all })
      if (courseSlug) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseSlug) })
        queryClient.refetchQueries({ queryKey: courseKeys.detail(courseSlug) })
      }
      showCreateSuccessToast('classSession', 'Class session created')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('classSession', error)
    },
  })
}

/**
 * Hook to update a class session
 * @param courseSlug - optional; when provided, invalidates course detail so class_sessions list refreshes
 */
export function useUpdateClassSession(courseSlug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClassSessionInput }) =>
      updateClassSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSessionKeys.all })
      if (courseSlug) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseSlug) })
        queryClient.refetchQueries({ queryKey: courseKeys.detail(courseSlug) })
      }
      showUpdateSuccessToast('classSession', 'Class session updated')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('classSession', error)
    },
  })
}

/**
 * Hook to delete a class session
 * @param courseSlug - optional; when provided, invalidates course detail so class_sessions list refreshes
 */
export function useDeleteClassSession(courseSlug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteClassSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSessionKeys.all })
      if (courseSlug) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseSlug) })
        queryClient.refetchQueries({ queryKey: courseKeys.detail(courseSlug) })
      }
      showDeleteSuccessToast('classSession')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('classSession', error)
    },
  })
}
