import apiClient from '@/services/api-client'
import type {
  TeachersResponse,
  TeacherResponse,
  CreateTeacherInput,
  UpdateTeacherInput,
} from '../types/teacher.types'

/**
 * Teacher service - handles all teacher-related API calls
 */

/**
 * Get all teachers with filters and pagination
 */
export async function getTeachers(params?: {
  page?: number
  per_page?: number
  status?: string
  department?: string
  employment_type?: string
  search?: string
  sort_by?: string
  sort_order?: string
}): Promise<TeachersResponse> {
  const response = await apiClient.get<TeachersResponse>('/teachers', { params })
  return response.data
}

/**
 * Get a single teacher by ID
 */
export async function getTeacherById(id: number): Promise<TeacherResponse> {
  const response = await apiClient.get<TeacherResponse>(`/teachers/${id}`)
  return response.data
}

/**
 * Create a new teacher
 */
export async function createTeacher(data: CreateTeacherInput): Promise<TeacherResponse> {
  const response = await apiClient.post<TeacherResponse>('/teachers', data)
  return response.data
}

/**
 * Update an existing teacher
 */
export async function updateTeacher(
  id: number,
  data: UpdateTeacherInput
): Promise<TeacherResponse> {
  const response = await apiClient.put<TeacherResponse>(`/teachers/${id}`, data)
  return response.data
}

/**
 * Delete a teacher
 */
export async function deleteTeacher(id: number): Promise<void> {
  await apiClient.delete(`/teachers/${id}`)
}

