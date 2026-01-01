import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
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
import { DEPARTMENT_OPTIONS, TEACHER_STATUS_OPTIONS, TEACHER_STATUS, EMPLOYMENT_TYPE_OPTIONS, EMPLOYMENT_TYPE, SUBJECT_OPTIONS } from '@/constants'
import { useCreateTeacher, useUpdateTeacher, useTeacher } from '../hooks/useTeachers'
import type { CreateTeacherInput, UpdateTeacherInput } from '../types/teacher.types'
import { createTeacherSchema, updateTeacherSchema, type CreateTeacherFormData, type UpdateTeacherFormData } from '../schemas/teacher.schemas'
import { useTranslation } from '@/i18n/context'

interface TeacherFormProps {
  teacherId?: string
}

/**
 * TeacherForm component - handles both create and edit
 */
export function TeacherForm({ teacherId }: TeacherFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!teacherId

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getEmploymentTypeLabel = (type: string) => {
    return t(`teacher.employmentType.${type}`) || type
  }

  const { 
    data: teacherData, 
    isLoading: isLoadingTeacher,
    isFetching: isFetchingTeacher,
    dataUpdatedAt: teacherDataUpdatedAt,
  } = useTeacher(
    teacherId ? parseInt(teacherId) : 0
  )

  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()

  // Select schema based on edit mode
  const teacherFormSchema = useMemo(() => {
    return isEditMode ? updateTeacherSchema : createTeacherSchema
  }, [isEditMode])

  // Type for form data based on mode
  type TeacherFormData = CreateTeacherFormData | UpdateTeacherFormData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: TEACHER_STATUS.ACTIVE,
      department: '',
      subject: '',
      employment_type: EMPLOYMENT_TYPE.FULL_TIME,
      salary: undefined,
      password: '',
      password_confirmation: '',
    },
  })

  // Track the last dataUpdatedAt timestamp and teacherId we used to populate the form
  const lastPopulatedRef = useRef<{ teacherId: string; timestamp: number } | null>(null)
  
  // Populate form values when teacher data loads (edit mode)
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !teacherId) {
      lastPopulatedRef.current = null
      return
    }
    
    // Wait for teacher data to be loaded
    if (isLoadingTeacher || isFetchingTeacher || !teacherData?.data) return
    
    // Check if we need to populate
    const shouldPopulate = 
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.teacherId !== teacherId ||
      teacherDataUpdatedAt > lastPopulatedRef.current.timestamp
    
    if (!shouldPopulate) return
    
    const teacher = teacherData.data
    
    // Determine department value
    const departmentValue = teacher.department && typeof teacher.department === 'string' 
      ? teacher.department 
      : ''
    
    // Determine subject value
    const subjectValue = teacher.subject && typeof teacher.subject === 'string' 
      ? teacher.subject 
      : ''
    
    // Reset form with all values at once using reset()
    reset({
      name: teacher.user.name || '',
      email: teacher.user.email || '',
      status: teacher.user.status || TEACHER_STATUS.ACTIVE,
      department: departmentValue,
      subject: subjectValue,
      employment_type: teacher.employment_type || EMPLOYMENT_TYPE.FULL_TIME,
      salary: teacher.salary || undefined,
      password: '',
      password_confirmation: '',
    }, {
      keepDefaultValues: false,
    })
    
    // Update the last populated tracking
    lastPopulatedRef.current = {
      teacherId,
      timestamp: teacherDataUpdatedAt,
    }
  }, [isEditMode, teacherId, teacherData, isLoadingTeacher, isFetchingTeacher, teacherDataUpdatedAt, reset])

  const onSubmit = async (data: TeacherFormData) => {
    if (isEditMode && teacherId) {
      const updateData: UpdateTeacherInput = {
        name: data.name,
        status: data.status,
        department: data.department || undefined,
        subject: data.subject || undefined,
        employment_type: data.employment_type,
        salary: data.salary || undefined,
      }
      
      // Include email if provided and not empty
      if (data.email && data.email.trim().length > 0) {
        updateData.email = data.email.trim()
      }
      
      // Only include password if provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password
        updateData.password_confirmation = data.password_confirmation
      }
      updateTeacher.mutate({ id: parseInt(teacherId), data: updateData })
    } else {
      const createData: CreateTeacherInput = {
        name: data.name,
        email: data.email || '',
        password: data.password || '',
        password_confirmation: data.password_confirmation || '',
        status: data.status,
        department: data.department,
        subject: data.subject,
        employment_type: data.employment_type,
        salary: data.salary ?? undefined,
      }
      createTeacher.mutate(createData)
    }
  }

  if (isEditMode && isLoadingTeacher) {
    return <FormSkeleton fieldsPerColumn={3} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t('teacher.pages.edit') : t('teacher.pages.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          key={isEditMode ? `teacher-form-${teacherId}` : 'teacher-form-create'}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('teacher.form.fullName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('teacher.form.enterFullName')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('common.labels.email')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder={t('auth.form.enterEmail')}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t('teacher.form.password')} {!isEditMode && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder={isEditMode ? t('teacher.form.leavePasswordBlank') : t('teacher.form.enterPassword')}
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
                    {t('teacher.form.confirmPassword')}{' '}
                    {!isEditMode && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    placeholder={t('teacher.form.confirmPasswordPlaceholder')}
                    disabled={isSubmitting}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              )}

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">{t('teacher.form.department')}</Label>
                <Select
                  value={watch('department') || undefined}
                  onValueChange={(value) =>
                    setValue('department', value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder={t('teacher.form.selectDepartment')} />
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

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">{t('teacher.form.subject')}</Label>
                <Select
                  value={watch('subject') || 'none'}
                  onValueChange={(value) =>
                    setValue('subject', value === 'none' ? undefined : value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={t('teacher.form.selectSubject')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('teacher.form.noSubject')}</SelectItem>
                    {SUBJECT_OPTIONS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Employment Type */}
              <div className="space-y-2">
                <Label htmlFor="employment_type">{t('teacher.form.employmentType')}</Label>
                <Select
                  value={watch('employment_type') || EMPLOYMENT_TYPE.FULL_TIME}
                  onValueChange={(value) => setValue('employment_type', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="employment_type">
                    <SelectValue placeholder={t('teacher.form.selectEmploymentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {getEmploymentTypeLabel(type.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employment_type && (
                  <p className="text-sm text-destructive">{errors.employment_type.message}</p>
                )}
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">{t('teacher.form.salary')}</Label>
                <Input
                  id="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('salary', { valueAsNumber: true })}
                  placeholder={t('teacher.form.enterSalary')}
                  disabled={isSubmitting}
                />
                {errors.salary && (
                  <p className="text-sm text-destructive">{errors.salary.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">{t('teacher.form.status')}</Label>
                <Select
                  value={watch('status') || TEACHER_STATUS.ACTIVE}
                  onValueChange={(value) => setValue('status', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('teacher.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHER_STATUS_OPTIONS.map((status) => (
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
              onClick={() => navigate('/teachers')}
              disabled={isSubmitting || createTeacher.isPending || updateTeacher.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('teacher.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting || createTeacher.isPending || updateTeacher.isPending}
            >
              {(isSubmitting || createTeacher.isPending || updateTeacher.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('teacher.messages.updating')
                    : t('teacher.messages.creating')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('teacher.actions.update')
                    : t('teacher.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

