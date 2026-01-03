import apiClient from '@/services/api-client'
import type {
  SchedulesResponse,
  ScheduleResponse,
  CreateScheduleInput,
  UpdateScheduleInput,
} from '../types/schedule.types'

/**
 * Schedule service - handles all schedule-related API calls
 */

/**
 * Get all schedules with filters and pagination
 */
export async function getSchedules(params?: {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: string
  course_id?: number
  teacher_id?: number
  day_of_week?: string
}): Promise<SchedulesResponse> {
  const response = await apiClient.get<SchedulesResponse>('/schedules', { params })
  return response.data
}

/**
 * Get a single schedule by id
 */
export async function getScheduleById(id: number): Promise<ScheduleResponse> {
  const response = await apiClient.get<ScheduleResponse>(`/schedules/${id}`)
  return response.data
}

/**
 * Get schedules by course ID
 */
export async function getSchedulesByCourse(courseId: number): Promise<SchedulesResponse> {
  const response = await apiClient.get<SchedulesResponse>(`/schedules/course/${courseId}`)
  return response.data
}

/**
 * Get schedules by teacher ID
 */
export async function getSchedulesByTeacher(teacherId: number): Promise<SchedulesResponse> {
  const response = await apiClient.get<SchedulesResponse>(`/schedules/teacher/${teacherId}`)
  return response.data
}

/**
 * Create a new schedule
 */
export async function createSchedule(data: CreateScheduleInput): Promise<ScheduleResponse> {
  const response = await apiClient.post<ScheduleResponse>('/schedules', data)
  return response.data
}

/**
 * Update an existing schedule
 */
export async function updateSchedule(
  id: number,
  data: UpdateScheduleInput
): Promise<ScheduleResponse> {
  const response = await apiClient.put<ScheduleResponse>(`/schedules/${id}`, data)
  return response.data
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(id: number): Promise<void> {
  await apiClient.delete(`/schedules/${id}`)
}

