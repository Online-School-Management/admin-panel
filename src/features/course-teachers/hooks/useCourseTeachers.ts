import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCourseTeachers,
  getCourseTeacherById,
  createCourseTeacher,
  updateCourseTeacher,
  deleteCourseTeacher,
} from '../services/course-teacher.service'
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
  CreateCourseTeacherInput,
  UpdateCourseTeacherInput,
} from '../types/course-teacher.types'

/**
 * Query keys for course-teacher-related queries
 */
export const courseTeacherKeys = {
  all: ['course-teachers'] as const,
  lists: () => [...courseTeacherKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...courseTeacherKeys.lists(), params] as const,
  details: () => [...courseTeacherKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseTeacherKeys.details(), id] as const,
  byCourse: (courseId: number) => [...courseTeacherKeys.all, 'course', courseId] as const,
  byTeacher: (teacherId: number) => [...courseTeacherKeys.all, 'teacher', teacherId] as const,
}

/**
 * Hook to fetch all course-teacher assignments with filters and pagination
 */
export function useCourseTeachers(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  course_id?: number
  teacher_id?: number
}) {
  return useQuery({
    queryKey: courseTeacherKeys.list(params),
    queryFn: () => getCourseTeachers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch course-teacher assignments by course ID
 */
export function useCourseTeachersByCourse(courseId: number) {
  return useQuery({
    queryKey: courseTeacherKeys.byCourse(courseId),
    queryFn: () => getCourseTeachers({ course_id: courseId, per_page: 0 }),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to fetch a single course-teacher assignment by id
 */
export function useCourseTeacher(id: number) {
  return useQuery({
    queryKey: courseTeacherKeys.detail(id),
    queryFn: () => getCourseTeacherById(id),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
  })
}

/**
 * Hook to create a new course-teacher assignment
 */
export function useCreateCourseTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCourseTeacherInput) => createCourseTeacher(data),
    onSuccess: (response) => {
      // Invalidate all course-teacher list queries
      queryClient.invalidateQueries({ queryKey: courseTeacherKeys.lists() })
      // Invalidate course-specific queries
      if (response.data.course?.id) {
        queryClient.invalidateQueries({ queryKey: courseTeacherKeys.byCourse(response.data.course.id) })
      }
      // Also refetch to ensure the list is updated immediately
      queryClient.refetchQueries({ queryKey: courseTeacherKeys.lists() })
      
      // Invalidate course queries to update assigned_teacher data
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
      
      showCreateSuccessToast('course-teacher assignment', 'Teacher assigned successfully')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('course-teacher assignment', error)
    },
  })
}

/**
 * Hook to update an existing course-teacher assignment
 */
export function useUpdateCourseTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseTeacherInput }) =>
      updateCourseTeacher(id, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: courseTeacherKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseTeacherKeys.lists() })
      // Invalidate and refetch detail query
      queryClient.invalidateQueries({ queryKey: courseTeacherKeys.detail(variables.id) })
      queryClient.refetchQueries({ queryKey: courseTeacherKeys.detail(variables.id) })
      // Invalidate course-specific queries
      if (response.data.course?.id) {
        queryClient.invalidateQueries({ queryKey: courseTeacherKeys.byCourse(response.data.course.id) })
      }
      
      // Invalidate course queries to update assigned_teacher data
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
      
      showUpdateSuccessToast('course-teacher assignment', 'Assignment updated successfully')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('course-teacher assignment', error)
    },
  })
}

/**
 * Hook to delete a course-teacher assignment
 */
export function useDeleteCourseTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCourseTeacher(id),
    onSuccess: () => {
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: courseTeacherKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseTeacherKeys.lists() })
      
      // Invalidate all course-specific queries (we don't know which course, so invalidate all)
      // This ensures that any course-teacher queries by course are refreshed
      queryClient.invalidateQueries({ queryKey: courseTeacherKeys.all })
      queryClient.refetchQueries({ queryKey: courseTeacherKeys.all })
      
      // Invalidate course queries to update assigned_teacher data
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
      queryClient.refetchQueries({ queryKey: courseKeys.lists() })
      // Invalidate all course detail queries (we don't know the slug, so invalidate all)
      queryClient.invalidateQueries({ queryKey: courseKeys.details() })
      
      showDeleteSuccessToast('course-teacher assignment')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('course-teacher assignment', error)
    },
  })
}

