import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/constants'

/**
 * Enrollment form validation schemas
 */

export const createEnrollmentSchema = z.object({
  student_id: z.number().int().positive(VALIDATION_MESSAGES.REQUIRED('Student')),
  course_id: z.number().int().positive(VALIDATION_MESSAGES.REQUIRED('Course')),
  enrolled_at: z.string().optional().nullable(),
  status: z.enum(['active', 'dropped', 'completed']).optional(),
  first_n_months_free: z.number().int().min(0).max(255).optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional().nullable(),
  discount_value: z.number().min(0).max(999999.99).optional().nullable(),
}).refine((data) => !data.discount_type || (data.discount_value != null && data.discount_value >= 0), {
  message: 'Discount value is required when discount type is set',
  path: ['discount_value'],
})

export const updateEnrollmentSchema = z.object({
  student_id: z.number().int().positive().optional(),
  course_id: z.number().int().positive().optional(),
  enrolled_at: z.string().optional().nullable(),
  status: z.enum(['active', 'dropped', 'completed']).optional(),
}).partial()

export type CreateEnrollmentFormData = z.infer<typeof createEnrollmentSchema>
export type UpdateEnrollmentFormData = z.infer<typeof updateEnrollmentSchema>

