import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/constants'

/**
 * Schedule form validation schemas
 */

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const createScheduleSchema = z
  .object({
    course_id: z.number().int().positive(VALIDATION_MESSAGES.REQUIRED('Course')),
    teacher_id: z.number().int().positive().optional(), // Optional in form since we set it automatically
    day_of_week: z.enum(DAYS_OF_WEEK, {
      message: VALIDATION_MESSAGES.REQUIRED('Day of week'),
    }),
    start_time: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('Start time')),
    end_time: z.string().min(1, VALIDATION_MESSAGES.REQUIRED('End time')),
    room_or_link: z.string().optional().nullable(),
    topic_covered: z.string().max(500, 'Topic covered must not exceed 500 characters').optional().nullable(),
  })
  .refine(
    (data) => {
      // Validate time format (HH:mm)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      return timeRegex.test(data.start_time) && timeRegex.test(data.end_time)
    },
    {
      message: 'Time must be in HH:mm format (e.g., 14:30)',
      path: ['start_time'],
    }
  )
  .refine(
    (data) => {
      // End time must be after start time
      const [startHours, startMinutes] = data.start_time.split(':').map(Number)
      const [endHours, endMinutes] = data.end_time.split(':').map(Number)
      const startTotal = startHours * 60 + startMinutes
      const endTotal = endHours * 60 + endMinutes
      return endTotal > startTotal
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  )
  .refine(
    (data) => {
      // Teacher ID must be set (should be set automatically from assigned teacher)
      return data.teacher_id !== undefined && data.teacher_id !== null
    },
    {
      message: 'Teacher must be assigned to this course',
      path: ['teacher_id'],
    }
  )

export const updateScheduleSchema = createScheduleSchema.partial().refine(
  (data) => {
    // If both times are provided, validate them
    if (data.start_time && data.end_time) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(data.start_time) || !timeRegex.test(data.end_time)) {
        return false
      }
      const [startHours, startMinutes] = data.start_time.split(':').map(Number)
      const [endHours, endMinutes] = data.end_time.split(':').map(Number)
      const startTotal = startHours * 60 + startMinutes
      const endTotal = endHours * 60 + endMinutes
      return endTotal > startTotal
    }
    return true
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
)

// Export types
export type CreateScheduleFormData = z.infer<typeof createScheduleSchema>
export type UpdateScheduleFormData = z.infer<typeof updateScheduleSchema>

