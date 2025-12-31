import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { PAGINATION, DEPARTMENT_OPTIONS, ADMIN_STATUS_OPTIONS, VALIDATION } from '@/constants'
import { useCreateAdmin, useUpdateAdmin, useAdmin } from '../hooks/useAdmins'
import { useRoles } from '@/features/roles/hooks/useRoles'
import type { CreateAdminInput, UpdateAdminInput } from '../types/admin.types'

// Base form validation schema - only required fields
const baseAdminFormSchema = z.object({
  name: z.string().min(VALIDATION.MIN_NAME_LENGTH, `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  department: z.string().optional(),
  role_id: z.number().optional(),
})

type AdminFormData = z.infer<typeof baseAdminFormSchema> & {
  password?: string
  password_confirmation?: string
}

interface AdminFormProps {
  adminId?: string
}

/**
 * AdminForm component - handles both create and edit
 */
export function AdminForm({ adminId }: AdminFormProps) {
  const navigate = useNavigate()
  const isEditMode = !!adminId

  const { 
    data: adminData, 
    isLoading: isLoadingAdmin,
    isFetching: isFetchingAdmin,
    dataUpdatedAt: adminDataUpdatedAt,
  } = useAdmin(
    adminId ? parseInt(adminId) : 0
  )
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({ per_page: PAGINATION.ROLES_PER_PAGE })
  const roles = rolesData?.data || []

  const createAdmin = useCreateAdmin()
  const updateAdmin = useUpdateAdmin()

  // Create schema based on edit mode
  const adminFormSchema = useMemo(() => {
    if (isEditMode) {
      return baseAdminFormSchema
        .extend({
          password: z
            .string()
            .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
            .optional()
            .or(z.literal('')),
          password_confirmation: z.string().optional(),
        })
        .refine(
          (data) => {
            // If password is provided, confirmation must match
            if (data.password && data.password.length > 0) {
              return data.password === data.password_confirmation
            }
            return true
          },
          {
            message: 'Passwords do not match',
            path: ['password_confirmation'],
          }
        )
    }
    return baseAdminFormSchema
      .extend({
        password: z.string().min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`),
        password_confirmation: z.string().min(1, 'Password confirmation is required'),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      })
  }, [isEditMode])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: '',
      status: 'active',
      department: '',
      role_id: undefined,
      password: '',
      password_confirmation: '',
    },
  })

  // Track the last dataUpdatedAt timestamp and adminId we used to populate the form
  const lastPopulatedRef = useRef<{ adminId: string; timestamp: number } | null>(null)
  
  // Populate form values when admin data loads (edit mode)
  // This effect runs whenever adminId, adminData, or rolesData changes
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !adminId) {
      lastPopulatedRef.current = null
      return
    }
    
    // Wait for admin data to be loaded (not loading/fetching and data exists)
    if (isLoadingAdmin || isFetchingAdmin || !adminData?.data) return
    
    // Wait for roles to be loaded (not loading and roles array exists)
    if (isLoadingRoles || !rolesData?.data) return
    
    // Check if we need to populate:
    // 1. Never populated before
    // 2. Different adminId (switched to different admin)
    // 3. Same adminId but data is newer (refetch happened)
    const shouldPopulate = 
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.adminId !== adminId ||
      adminDataUpdatedAt > lastPopulatedRef.current.timestamp
    
    if (!shouldPopulate) return
    
    const admin = adminData.data
    const roles = rolesData.data
    
    // Determine role_id
    let roleId: number | undefined = undefined
    if (admin.roles && Array.isArray(admin.roles) && admin.roles.length > 0) {
      const firstRole = admin.roles[0]
      const extractedRoleId = typeof firstRole === 'object' && firstRole !== null && 'id' in firstRole
        ? firstRole.id
        : null
      
      // Verify the role exists in the roles list before setting
      if (extractedRoleId !== null && typeof extractedRoleId === 'number') {
        const roleExists = roles.some(role => role.id === extractedRoleId)
        if (roleExists) {
          roleId = extractedRoleId
        }
      }
    }
    
    // Determine department value
    const departmentValue = admin.department && typeof admin.department === 'string' 
      ? admin.department 
      : ''
    
    // Reset form with all values at once using reset() - this is more reliable
    reset({
      name: admin.user.name || '',
      status: admin.user.status || 'active',
      department: departmentValue,
      role_id: roleId,
      password: '',
      password_confirmation: '',
    }, {
      keepDefaultValues: false,
    })
    
    // Update the last populated tracking
    lastPopulatedRef.current = {
      adminId,
      timestamp: adminDataUpdatedAt,
    }
  }, [isEditMode, adminId, adminData, isLoadingAdmin, isFetchingAdmin, adminDataUpdatedAt, rolesData, isLoadingRoles, reset])

  const onSubmit = async (data: AdminFormData) => {
    if (isEditMode && adminId) {
      const updateData: UpdateAdminInput = {
        name: data.name,
        status: data.status,
        department: data.department || undefined,
      }
      
      // Include role_id only if it's a valid number (role is selected)
      // If undefined, don't include it (backend won't change roles)
      // If null, include it (backend will remove all roles)
      if (data.role_id !== undefined) {
        updateData.role_id = typeof data.role_id === 'number' ? data.role_id : (null as number | null)
      }
      
      // Only include password if provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password
        updateData.password_confirmation = data.password_confirmation
      }
      updateAdmin.mutate({ id: parseInt(adminId), data: updateData })
    } else {
      const createData: CreateAdminInput = {
        name: data.name,
        password: data.password || '',
        password_confirmation: data.password_confirmation || '',
        status: data.status,
        department: data.department,
        role_id: data.role_id,
      }
      createAdmin.mutate(createData)
    }
  }

  if (isEditMode && (isLoadingAdmin || isLoadingRoles)) {
    return <FormSkeleton fieldsPerColumn={3} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Admin' : 'Create Admin'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          key={isEditMode ? `admin-form-${adminId}` : 'admin-form-create'}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Form fields - only required fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {!isEditMode && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Password Confirmation */}
              {(!isEditMode || watch('password')) && (
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password{' '}
                    {!isEditMode && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={watch('department') || undefined}
                  onValueChange={(value) =>
                    setValue('department', value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role_id">Role</Label>
                <Select
                  value={
                    (() => {
                      const roleId = watch('role_id')
                      return roleId !== undefined && roleId !== null
                        ? roleId.toString()
                        : undefined
                    })()
                  }
                  onValueChange={(value) =>
                    setValue('role_id', parseInt(value))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="role_id">
                    <SelectValue placeholder="Select role (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && (
                  <p className="text-sm text-destructive">{errors.role_id.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status') || 'active'}
                  onValueChange={(value) => setValue('status', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admins')}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Admin'
                  : 'Create Admin'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

