import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSchedules,
  getScheduleById,
  getSchedulesByCourse,
  getSchedulesByTeacher,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../services/schedule.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import { courseKeys } from '@/features/courses/hooks/useCourses'
import type {
  CreateScheduleInput,
  UpdateScheduleInput,
} from '../types/schedule.types'

/**
 * Query keys for schedule-related queries
 */
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...scheduleKeys.lists(), params] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: number) => [...scheduleKeys.details(), id] as const,
  byCourse: (courseId: number) => [...scheduleKeys.all, 'course', courseId] as const,
  byTeacher: (teacherId: number) => [...scheduleKeys.all, 'teacher', teacherId] as const,
}

/**
 * Hook to fetch all schedules with filters and pagination
 */
export function useSchedules(params?: {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: string
  course_id?: number
  teacher_id?: number
  day_of_week?: string
}) {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => getSchedules(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch schedules by course ID
 */
export function useSchedulesByCourse(courseId: number) {
  return useQuery({
    queryKey: scheduleKeys.byCourse(courseId),
    queryFn: () => getSchedulesByCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch schedules by teacher ID
 */
export function useSchedulesByTeacher(teacherId: number) {
  return useQuery({
    queryKey: scheduleKeys.byTeacher(teacherId),
    queryFn: () => getSchedulesByTeacher(teacherId),
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single schedule by id
 */
export function useSchedule(id: number) {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => getScheduleById(id),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
  })
}

/**
 * Hook to create a new schedule
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleInput) => createSchedule(data),
    onSuccess: (response) => {
      // Invalidate all schedule list queries
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.refetchQueries({ queryKey: scheduleKeys.lists() })
      
      // Invalidate course-specific queries
      if (response.data.course?.id) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.byCourse(response.data.course.id) })
        queryClient.refetchQueries({ queryKey: scheduleKeys.byCourse(response.data.course.id) })
      }
      
      // Invalidate course queries to update total_hours
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      
      // Invalidate specific course detail if we have the slug
      if (response.data.course?.slug) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(response.data.course.slug) })
        queryClient.refetchQueries({ queryKey: courseKeys.detail(response.data.course.slug) })
      } else {
        // Fallback: invalidate all course detail queries
        queryClient.invalidateQueries({ queryKey: courseKeys.details() })
      }
      
      showCreateSuccessToast('schedule', 'Schedule created successfully')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('schedule', error)
    },
  })
}

/**
 * Hook to update an existing schedule
 */
export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleInput }) =>
      updateSchedule(id, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.refetchQueries({ queryKey: scheduleKeys.lists() })
      
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(variables.id) })
      queryClient.refetchQueries({ queryKey: scheduleKeys.detail(variables.id) })
      
      // Invalidate course-specific queries
      if (response.data.course?.id) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.byCourse(response.data.course.id) })
        queryClient.refetchQueries({ queryKey: scheduleKeys.byCourse(response.data.course.id) })
      }
      
      // Invalidate course queries to update total_hours
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      
      // Invalidate specific course detail if we have the slug
      if (response.data.course?.slug) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(response.data.course.slug) })
        queryClient.refetchQueries({ queryKey: courseKeys.detail(response.data.course.slug) })
      } else {
        // Fallback: invalidate all course detail queries
        queryClient.invalidateQueries({ queryKey: courseKeys.details() })
      }
      
      showUpdateSuccessToast('schedule', 'Schedule updated successfully')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('schedule', error)
    },
  })
}

/**
 * Hook to delete a schedule
 */
export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: () => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.refetchQueries({ queryKey: scheduleKeys.lists() })
      
      // Invalidate all schedule queries
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
      queryClient.refetchQueries({ queryKey: scheduleKeys.all })
      
      // Invalidate course queries to update total_hours
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      
      // Invalidate all course detail queries
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
      
      showDeleteSuccessToast('schedule')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('schedule', error)
    },
  })
}

