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
import { useCreateUser, useUpdateUser, useUser } from '../hooks/useUsers'
import type { CreateUserInput, UpdateUserInput } from '../types/user.types'

// Base form validation schema
const baseUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  role: z.enum(['admin', 'user', 'moderator']),
  userType: z.enum(['individual', 'company']).optional(),
  memberLevel: z.enum(['silver', 'gold', 'platinum']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
})

type UserFormData = z.infer<typeof baseUserFormSchema> & {
  password?: string
}

interface UserFormProps {
  userId?: string
}

/**
 * UserForm component - handles both create and edit
 */
export function UserForm({ userId }: UserFormProps) {
  const navigate = useNavigate()
  const isEditMode = !!userId

  const { data: userData, isLoading: isLoadingUser } = useUser(userId || '')
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  // Create schema based on edit mode
  const userFormSchema = useMemo(() => {
    if (isEditMode) {
      return baseUserFormSchema.extend({
        password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
      })
    }
    return baseUserFormSchema.extend({
      password: z.string().min(6, 'Password must be at least 6 characters'),
    })
  }, [isEditMode])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      userType: 'individual',
      memberLevel: 'silver',
      status: 'active',
      password: '',
    },
  })

  // Set form values when user data loads (edit mode)
  useEffect(() => {
    if (isEditMode && userData?.user && !isLoadingUser) {
      const user = userData.user
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('phoneNumber', user.phoneNumber || '')
      setValue('role', user.role)
      setValue('userType', user.userType || 'individual')
      setValue('memberLevel', user.memberLevel || 'silver')
      setValue('status', user.status)
    }
  }, [isEditMode, userData, isLoadingUser, setValue])

  const onSubmit = async (data: UserFormData) => {
    if (isEditMode && userId) {
      const updateData: UpdateUserInput = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        userType: data.userType,
        memberLevel: data.memberLevel,
        status: data.status,
      }
      // Only include password if provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password
      }
      updateUser.mutate({ id: userId, data: updateData })
    } else {
      const createData: CreateUserInput = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        userType: data.userType,
        memberLevel: data.memberLevel,
        status: data.status,
        password: data.password || '',
      }
      createUser.mutate(createData)
    }
  }

  if (isEditMode && isLoadingUser) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading user...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Two-column grid for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">**</span>
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
                  Password <span className="text-destructive">**</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Member Level */}
              <div className="space-y-2">
                <Label htmlFor="memberLevel">
                  Member Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('memberLevel') || 'silver'}
                  onValueChange={(value) => setValue('memberLevel', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="memberLevel">
                    <SelectValue placeholder="Select member level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
                {errors.memberLevel && (
                  <p className="text-sm text-destructive">
                    {errors.memberLevel.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-destructive">**</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">**</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="userType">
                  User Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('userType') || 'individual'}
                  onValueChange={(value) => setValue('userType', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual User</SelectItem>
                    <SelectItem value="company">Company User</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-sm text-destructive">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
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
                  <p className="text-sm text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions - Buttons at bottom */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="default"
              onClick={() => navigate('/users')}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting
                ? 'Creating...'
                : isEditMode
                  ? 'Update User'
                  : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
