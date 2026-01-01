import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { PAGINATION, DEPARTMENT_OPTIONS, ADMIN_STATUS_OPTIONS, ADMIN_STATUS } from '@/constants'
import { useCreateAdmin, useUpdateAdmin, useAdmin } from '../hooks/useAdmins'
import { useRoles } from '@/features/roles/hooks/useRoles'
import type { CreateAdminInput, UpdateAdminInput } from '../types/admin.types'
import { createAdminSchema, updateAdminSchema, type CreateAdminFormData, type UpdateAdminFormData } from '../schemas/admin.schemas'
import { useTranslation } from '@/i18n/context'

interface AdminFormProps {
  adminId?: string
}

/**
 * AdminForm component - handles both create and edit
 */
export function AdminForm({ adminId }: AdminFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!adminId

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

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

  // Select schema based on edit mode
  const adminFormSchema = useMemo(() => {
    return isEditMode ? updateAdminSchema : createAdminSchema
  }, [isEditMode])

  // Type for form data based on mode
  type AdminFormData = CreateAdminFormData | UpdateAdminFormData

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
      status: ADMIN_STATUS.ACTIVE,
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
      status: admin.user.status || ADMIN_STATUS.ACTIVE,
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
        <CardTitle>{isEditMode ? t('admin.pages.edit') : t('admin.pages.create')}</CardTitle>
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
                  {t('admin.form.fullName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('admin.form.enterFullName')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t('admin.form.password')} {!isEditMode && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={isEditMode ? t('admin.form.leavePasswordBlank') : t('admin.form.enterPassword')}
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
                    {t('admin.form.confirmPassword')}{' '}
                    {!isEditMode && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    placeholder={t('admin.form.confirmPasswordPlaceholder')}
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
                <Label htmlFor="department">{t('admin.form.department')}</Label>
                <Select
                  value={watch('department') || undefined}
                  onValueChange={(value) =>
                    setValue('department', value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder={t('admin.form.selectDepartment')} />
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
                <Label htmlFor="role_id">{t('admin.form.role')}</Label>
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
                    <SelectValue placeholder={t('admin.form.selectRole')} />
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
                <Label htmlFor="status">{t('admin.form.status')}</Label>
                <Select
                  value={watch('status') || ADMIN_STATUS.ACTIVE}
                  onValueChange={(value) => setValue('status', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('admin.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {getStatusLabel(status.value)}
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
              {t('admin.actions.cancel')}
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting
                ? isEditMode
                  ? t('admin.messages.updating')
                  : t('admin.messages.creating')
                : isEditMode
                  ? t('admin.actions.update')
                  : t('admin.actions.create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

