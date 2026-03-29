export interface MonthlyCloseSnapshot {
  id: number
  year: number
  month: number
  total_from_students: number
  total_to_teachers: number
  prepayment_carry_forward: number
  closed_at: string | null
  closed_by: number | null
  closed_by_admin?: { id: number; name: string | null } | null
  created_at?: string
  updated_at?: string
}

export interface MonthlyCloseSnapshotResponse {
  success: boolean
  message?: string
  data: MonthlyCloseSnapshot
}
