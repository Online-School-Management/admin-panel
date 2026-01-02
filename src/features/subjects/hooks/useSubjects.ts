import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getSubjects,
  getSubjectBySlug,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../services/subject.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from '../types/subject.types'

/**
 * Query keys for subject-related queries
 */
export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...subjectKeys.lists(), params] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (slug: string) => [...subjectKeys.details(), slug] as const,
}

/**
 * Hook to fetch all subjects with filters and pagination
 */
export function useSubjects(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => getSubjects(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single subject by slug
 */
export function useSubject(slug: string) {
  return useQuery({
    queryKey: subjectKeys.detail(slug),
    queryFn: () => getSubjectBySlug(slug),
    enabled: !!slug,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}

/**
 * Hook to create a new subject
 */
export function useCreateSubject() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateSubjectInput) => createSubject(data),
    onSuccess: (response) => {
      // Invalidate all subject list queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: subjectKeys.lists() })
      showCreateSuccessToast('subject', `${response.data.name} has been added`)
      navigate('/subjects')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('subject', error)
    },
  })
}

/**
 * Hook to update an existing subject
 */
export function useUpdateSubject() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateSubjectInput }) =>
      updateSubject(slug, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      queryClient.refetchQueries({ queryKey: subjectKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(variables.slug) })
      queryClient.refetchQueries({ queryKey: subjectKeys.detail(variables.slug) })
      showUpdateSuccessToast('subject', `${response.data.name} has been updated`)
      navigate('/subjects')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('subject', error)
    },
  })
}

/**
 * Hook to delete a subject
 */
export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteSubject(slug),
    onSuccess: () => {
      // Invalidate and refetch list queries to ensure the deleted subject is removed
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      queryClient.refetchQueries({ queryKey: subjectKeys.lists() })
      showDeleteSuccessToast('subject')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('subject', error)
    },
  })
}

