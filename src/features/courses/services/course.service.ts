import apiClient from '@/services/api-client'
import type {
  CoursesResponse,
  CourseResponse,
  CoursesForAdminFiltersResponse,
  CreateCourseInput,
  UpdateCourseInput,
} from '../types/course.types'

/**
 * Course service - handles all course-related API calls
 */

/**
 * Get all courses with filters and pagination
 */
export async function getCourses(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  status?: string
  subject_id?: number
  teacher_id?: number
}): Promise<CoursesResponse> {
  const response = await apiClient.get<CoursesResponse>('/courses', { params })
  return response.data
}

export async function getCoursesForAdminFilters(): Promise<CoursesForAdminFiltersResponse> {
  const response = await apiClient.get<CoursesForAdminFiltersResponse>('/courses/for-admin-filters')
  return response.data
}

/**
 * Get a single course by numeric ID (admin).
 */
export async function getCourseById(id: number): Promise<CourseResponse> {
  const response = await apiClient.get<CourseResponse>(`/courses/by-id/${id}`)
  return response.data
}

/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string): Promise<CourseResponse> {
  const response = await apiClient.get<CourseResponse>(`/courses/${slug}`)
  return response.data
}

/**
 * Create a new course
 */
export async function createCourse(data: CreateCourseInput): Promise<CourseResponse> {
  const response = await apiClient.post<CourseResponse>('/courses', data)
  return response.data
}

/**
 * Update an existing course
 */
export async function updateCourse(
  slug: string,
  data: UpdateCourseInput
): Promise<CourseResponse> {
  const response = await apiClient.put<CourseResponse>(`/courses/${slug}`, data)
  return response.data
}

/**
 * Delete a course
 */
export async function deleteCourse(slug: string): Promise<void> {
  await apiClient.delete(`/courses/${slug}`)
}



