import apiClient from '@/services/api-client'
import type {
  CourseTeachersResponse,
  CourseTeacherResponse,
  CreateCourseTeacherInput,
  UpdateCourseTeacherInput,
} from '../types/course-teacher.types'

/**
 * Course-Teacher service - handles all course-teacher-related API calls
 */

/**
 * Get all course-teacher assignments with filters and pagination
 */
export async function getCourseTeachers(params?: {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  course_id?: number
  teacher_id?: number
}): Promise<CourseTeachersResponse> {
  const response = await apiClient.get<CourseTeachersResponse>('/course-teachers', { params })
  return response.data
}

/**
 * Get a single course-teacher assignment by id
 */
export async function getCourseTeacherById(id: number): Promise<CourseTeacherResponse> {
  const response = await apiClient.get<CourseTeacherResponse>(`/course-teachers/${id}`)
  return response.data
}

/**
 * Create a new course-teacher assignment
 */
export async function createCourseTeacher(data: CreateCourseTeacherInput): Promise<CourseTeacherResponse> {
  const response = await apiClient.post<CourseTeacherResponse>('/course-teachers', data)
  return response.data
}

/**
 * Update an existing course-teacher assignment
 */
export async function updateCourseTeacher(
  id: number,
  data: UpdateCourseTeacherInput
): Promise<CourseTeacherResponse> {
  const response = await apiClient.put<CourseTeacherResponse>(`/course-teachers/${id}`, data)
  return response.data
}

/**
 * Delete a course-teacher assignment
 */
export async function deleteCourseTeacher(id: number): Promise<void> {
  await apiClient.delete(`/course-teachers/${id}`)
}



