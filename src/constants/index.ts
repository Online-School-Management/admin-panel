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

// Department options
export const DEPARTMENT_OPTIONS = [
  'Teacher Management',
  'Administration',
  'Student Management',
  'Employee Management',
] as const

// API configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
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

