import apiClient from '@/services/api-client'
import type { MonthlyCloseSnapshotResponse } from '../types/monthly-close.types'

export async function closeMonth(year: number, month: number): Promise<MonthlyCloseSnapshotResponse> {
  const response = await apiClient.post<MonthlyCloseSnapshotResponse>('/monthly-close/close', {
    year,
    month,
  })
  return response.data
}
