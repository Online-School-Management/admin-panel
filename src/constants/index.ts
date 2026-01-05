/**
 * Application-wide constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

// Toast durations (in milliseconds)
export const TOAST_DURATION = {
  SHORT: 3000,    // 3 seconds
  DEFAULT: 5000,  // 5 seconds
  LONG: 10000,    // 10 seconds
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 15,
  PER_PAGE_OPTIONS: [10, 15, 25, 50, 100] as const,
  ROLES_PER_PAGE: 100, // For dropdowns/selects
} as const

// Admin status options
export const ADMIN_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export const ADMIN_STATUS_OPTIONS = [
  { value: ADMIN_STATUS.ACTIVE, label: 'Active' },
  { value: ADMIN_STATUS.INACTIVE, label: 'Inactive' },
  { value: ADMIN_STATUS.SUSPENDED, label: 'Suspended' },
] as const

// Role status options
export const ROLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export const ROLE_STATUS_OPTIONS = [
  { value: ROLE_STATUS.ACTIVE, label: 'Active' },
  { value: ROLE_STATUS.INACTIVE, label: 'Inactive' },
] as const

// Teacher status options
export const TEACHER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export const TEACHER_STATUS_OPTIONS = [
  { value: TEACHER_STATUS.ACTIVE, label: 'Active' },
  { value: TEACHER_STATUS.INACTIVE, label: 'Inactive' },
  { value: TEACHER_STATUS.SUSPENDED, label: 'Suspended' },
] as const

// Employment type options
export const EMPLOYMENT_TYPE = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
} as const

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: EMPLOYMENT_TYPE.FULL_TIME, label: 'Full-time' },
  { value: EMPLOYMENT_TYPE.PART_TIME, label: 'Part-time' },
  { value: EMPLOYMENT_TYPE.CONTRACT, label: 'Contract' },
] as const

// Subject options (can be extended later)
export const SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
] as const

// Department options
export const DEPARTMENT_OPTIONS = [
  'Teacher Management',
  'Administration',
  'Student Management',
  'Employee Management',
] as const

// Course status options
export const COURSE_STATUS = {
  UPCOMING: 'upcoming',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

// Payment status options
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
} as const

export const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.PENDING, label: 'Pending' },
  { value: PAYMENT_STATUS.PAID, label: 'Paid' },
] as const

// Payment method options
export const PAYMENT_METHOD = {
  KBZ_PAY: 'kbz_pay',
  AYA_PAY: 'aya_pay',
  KBZ_MOBILE_BANKING: 'kbz_mobile_banking',
  WAVE_MONEY: 'wave_money',
} as const

export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHOD.KBZ_PAY, label: 'KBZ Pay' },
  { value: PAYMENT_METHOD.AYA_PAY, label: 'AYA Pay' },
  { value: PAYMENT_METHOD.KBZ_MOBILE_BANKING, label: 'KBZ Mobile Banking' },
  { value: PAYMENT_METHOD.WAVE_MONEY, label: 'Wave Money' },
] as const

export const COURSE_STATUS_OPTIONS = [
  { value: COURSE_STATUS.UPCOMING, label: 'Upcoming' },
  { value: COURSE_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: COURSE_STATUS.COMPLETED, label: 'Completed' },
  { value: COURSE_STATUS.CANCELLED, label: 'Cancelled' },
] as const

// Course type options
export const COURSE_TYPE = {
  ONE_ON_ONE: 'one_on_one',
  PRIVATE: 'private',
  GROUP: 'group',
  TEACHER_TRAINING: 'teacher_training',
} as const

export const COURSE_TYPE_OPTIONS = [
  { value: COURSE_TYPE.ONE_ON_ONE, label: 'One-on-One' },
  { value: COURSE_TYPE.PRIVATE, label: 'Private' },
  { value: COURSE_TYPE.GROUP, label: 'Group' },
  { value: COURSE_TYPE.TEACHER_TRAINING, label: 'Teacher Training' },
] as const

// API configuration
export const API_CONFIG = {
  TIMEOUT: 5000, // 5 seconds - reduced for faster failure detection
  BASE_URL: 'http://localhost:8000/api/v1/backend',
} as const

// Form validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
} as const

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_CONFIRMATION_REQUIRED: 'Password confirmation is required',
} as const

// Badge variants mapping
export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  SECONDARY: 'secondary',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
} as const

// Skeleton loader defaults
export const SKELETON = {
  DEFAULT_ROWS: 5,
  DEFAULT_FIELDS_COUNT: 4,
  DEFAULT_FIELDS_PER_ROW: 2,
} as const

