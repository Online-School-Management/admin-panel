import apiClient from '@/services/api-client'
import type {
  ClassSessionsResponse,
  ClassSessionDetailResponse,
  ClassSessionListItem,
  UpdateClassSessionInput,
  CreateClassSessionInput,
} from '../types/class-session.types'

/**
 * Class session service - fetches sessions by date and single session for edit
 */

/**
 * Get class sessions for a specific date
 * @param date YYYY-MM-DD
 */
export async function getClassSessionsByDate(date: string): Promise<ClassSessionsResponse> {
  const response = await apiClient.get<ClassSessionsResponse>('/class-sessions', {
    params: { date },
  })
  return response.data
}

/**
 * Get a single class session (for edit form)
 */
export async function getClassSession(id: number): Promise<ClassSessionDetailResponse> {
  const response = await apiClient.get<ClassSessionDetailResponse>(`/class-sessions/${id}`)
  return response.data
}

/**
 * Create a class session manually (e.g. for teacher adjustments or extra sessions)
 */
export async function createClassSession(
  data: CreateClassSessionInput
): Promise<{ success: boolean; message?: string; data: ClassSessionListItem }> {
  const response = await apiClient.post<{
    success: boolean
    message?: string
    data: ClassSessionListItem
  }>('/class-sessions', data)
  return response.data
}

/**
 * Update a class session (status, topic_covered, room_or_link)
 */
export async function updateClassSession(
  id: number,
  data: UpdateClassSessionInput
): Promise<{ success: boolean; message?: string; data: ClassSessionListItem }> {
  const response = await apiClient.put<{
    success: boolean
    message?: string
    data: ClassSessionListItem
  }>(`/class-sessions/${id}`, data)
  return response.data
}
