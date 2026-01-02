import { z } from 'zod'
import { VALIDATION, VALIDATION_MESSAGES, COURSE_STATUS } from '@/constants'

/**
 * Course form validation schemas
 * Separate schemas for create and update operations
 */

// Base schema shared by both create and update (without refinements)
const courseFormBaseSchema = z.object({
  subject_id: z
    .number()
    .int()
    .positive(VALIDATION_MESSAGES.REQUIRED('Subject')),
  title: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Title', VALIDATION.MIN_NAME_LENGTH)),
  duration_months: z.number().int().min(1).max(120).optional(),
  monthly_fee: z.number().min(0).max(999999.99).optional().nullable(),
  status: z.enum([COURSE_STATUS.UPCOMING, COURSE_STATUS.ACTIVE, COURSE_STATUS.COMPLETED, COURSE_STATUS.CANCELLED]).optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
})

/**
 * Schema for creating a new course
 */
export const createCourseSchema = courseFormBaseSchema.refine(
  (data) => {
    // If both dates are provided, end_date must be after start_date
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date)
    }
    return true
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
)

/**
 * Schema for updating an existing course
 */
export const updateCourseSchema = courseFormBaseSchema.extend({
  subject_id: z
    .number()
    .int()
    .positive(VALIDATION_MESSAGES.REQUIRED('Subject'))
    .optional(),
  title: z
    .string()
    .min(VALIDATION.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH('Title', VALIDATION.MIN_NAME_LENGTH))
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // If both dates are provided, end_date must be after start_date
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date)
    }
    return true
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
)

// Export types
export type CreateCourseFormData = z.infer<typeof createCourseSchema>
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>

