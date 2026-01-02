import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES } from '@/constants'

/**
 * Student form validation schemas
 * Separate schemas for create and update operations
 * Note: Password is not required for students (default password is set on backend)
 */

// Base schema shared by both create and update
const studentFormBaseSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Name', VALIDATION.MIN_NAME_LENGTH)),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  guardian_phone: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Guardian Phone')),
  age: z.number().int().min(1, VALIDATION_MESSAGES.MIN_LENGTH('Age', 1)).max(150),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Address')),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  date_of_birth: z.string().optional().nullable(),
})

/**
 * Schema for creating a new student
 * Password is NOT required (default password is set on backend)
 */
export const createStudentSchema = studentFormBaseSchema

/**
 * Schema for updating an existing student
 * All mandatory fields are required (name, email, guardian_phone, age, gender, address)
 * Password is optional (only validate if provided)
 */
export const updateStudentSchema = studentFormBaseSchema.extend({
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
export type CreateStudentFormData = z.infer<typeof createStudentSchema>
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>

