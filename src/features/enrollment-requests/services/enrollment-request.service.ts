import apiClient from '@/services/api-client'
import type {
  EnrollmentRequestsResponse,
  EnrollmentRequestResponse,
  ApproveEnrollmentRequestInput,
  RejectEnrollmentRequestInput,
} from '../types/enrollment-request.types'

const BASE_URL = '/enrollment-requests'

export async function getEnrollmentRequests(params?: {
  page?: number
  per_page?: number
  status?: string
  course_id?: number
  user_id?: number
  search?: string
  created_from?: string
  created_to?: string
  sort_by?: string
  sort_order?: string
}): Promise<EnrollmentRequestsResponse> {
  const response = await apiClient.get<EnrollmentRequestsResponse>(BASE_URL, { params })
  return response.data
}

export async function getEnrollmentRequestById(id: number): Promise<EnrollmentRequestResponse> {
  const response = await apiClient.get<EnrollmentRequestResponse>(`${BASE_URL}/${id}`)
  return response.data
}

export async function approveEnrollmentRequest(
  id: number,
  data?: ApproveEnrollmentRequestInput
): Promise<EnrollmentRequestResponse> {
  const response = await apiClient.post<EnrollmentRequestResponse>(
    `${BASE_URL}/${id}/approve`,
    data ?? {}
  )
  return response.data
}

export async function rejectEnrollmentRequest(
  id: number,
  data: RejectEnrollmentRequestInput
): Promise<EnrollmentRequestResponse> {
  const response = await apiClient.post<EnrollmentRequestResponse>(
    `${BASE_URL}/${id}/reject`,
    data
  )
  return response.data
}
