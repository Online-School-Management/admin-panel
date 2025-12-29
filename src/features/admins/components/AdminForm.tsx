import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
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
import { useCreateAdmin, useUpdateAdmin, useAdmin } from '../hooks/useAdmins'
import { useRoles } from '@/features/roles/hooks/useRoles'
import type { CreateAdminInput, UpdateAdminInput } from '../types/admin.types'

// Base form validation schema - only required fields
const baseAdminFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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

  const { data: adminData, isLoading: isLoadingAdmin } = useAdmin(
    adminId ? parseInt(adminId) : 0
  )
  const { data: rolesData } = useRoles({ per_page: 100 })
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
            .min(8, 'Password must be at least 8 characters')
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
        password: z.string().min(8, 'Password must be at least 8 characters'),
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

  // Set form values when admin data loads (edit mode)
  useEffect(() => {
    if (isEditMode && adminData?.data && !isLoadingAdmin) {
      const admin = adminData.data
      setValue('name', admin.user.name)
      setValue('status', admin.user.status)
      setValue('department', admin.department || '')
      // Set role_id if admin has roles
      if (admin.roles && admin.roles.length > 0) {
        setValue('role_id', admin.roles[0].id)
      }
    }
  }, [isEditMode, adminData, isLoadingAdmin, setValue])

  const onSubmit = async (data: AdminFormData) => {
    if (isEditMode && adminId) {
      const updateData: UpdateAdminInput = {
        name: data.name,
        status: data.status,
        department: data.department,
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

  if (isEditMode && isLoadingAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading admin...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Admin' : 'Create Admin'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Input
                  id="department"
                  {...register('department')}
                  placeholder="Enter department"
                  disabled={isSubmitting}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role_id">Role</Label>
                <Select
                  value={watch('role_id')?.toString() || undefined}
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
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

