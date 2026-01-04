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
})

export const updateEnrollmentSchema = createEnrollmentSchema.partial()

export type CreateEnrollmentFormData = z.infer<typeof createEnrollmentSchema>
export type UpdateEnrollmentFormData = z.infer<typeof updateEnrollmentSchema>

