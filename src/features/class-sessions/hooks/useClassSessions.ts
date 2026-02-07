import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getClassSessionsByDate,
  getClassSession,
  updateClassSession,
} from '../services/class-session.service'
import type { UpdateClassSessionInput } from '../types/class-session.types'
import { showUpdateSuccessToast, showUpdateErrorToast } from '@/utils/toast'

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
 * Hook to update a class session
 */
export function useUpdateClassSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClassSessionInput }) =>
      updateClassSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classSessionKeys.all })
      showUpdateSuccessToast('classSession', 'Class session updated')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('classSession', error)
    },
  })
}
