import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES, TEACHER_STATUS, EMPLOYMENT_TYPE } from '@/constants'

/**
 * Teacher form validation schemas
 * Separate schemas for create and update operations
 */

// Base schema shared by both create and update
const teacherFormBaseSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH)),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  status: z.enum([TEACHER_STATUS.ACTIVE, TEACHER_STATUS.INACTIVE, TEACHER_STATUS.SUSPENDED]).optional(),
  department: z.string().optional(),
  subject: z.string().optional(),
  employment_type: z.enum([EMPLOYMENT_TYPE.FULL_TIME, EMPLOYMENT_TYPE.PART_TIME, EMPLOYMENT_TYPE.CONTRACT]).optional(),
  salary: z.number().min(0).optional().nullable(),
})

/**
 * Schema for creating a new teacher
 * Password is required
 */
export const createTeacherSchema = teacherFormBaseSchema.extend({
  password: z
    .string()
    .min(VALIDATION.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Password', VALIDATION.MIN_PASSWORD_LENGTH)),
  password_confirmation: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRMATION_REQUIRED),
}).refine(
  (data) => data.password === data.password_confirmation,
  {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['password_confirmation'],
  }
)

/**
 * Schema for updating an existing teacher
 * Password is optional (only validate if provided)
 * Email is optional (can be updated)
 */
export const updateTeacherSchema = teacherFormBaseSchema.extend({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL).optional().or(z.literal('')),
  password: z
    .string()
    .min(VALIDATION.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Password', VALIDATION.MIN_PASSWORD_LENGTH))
    .optional()
    .or(z.literal('')),
  password_confirmation: z.string().optional(),
}).refine(
  (data) => {
    // If password is provided, confirmation must match
    if (data.password && data.password.length > 0) {
      return data.password === data.password_confirmation
    }
    return true
  },
  {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['password_confirmation'],
  }
)

// Export types
export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>
export type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>

