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
import { useCreateStudent, useUpdateStudent, useStudent } from '../hooks/useStudents'
import type { CreateStudentInput, UpdateStudentInput } from '../types/student.types'
import { createStudentSchema, updateStudentSchema, type CreateStudentFormData, type UpdateStudentFormData } from '../schemas/student.schemas'
import { useTranslation } from '@/i18n/context'

interface StudentFormProps {
  studentSlug?: string
}

/**
 * StudentForm component - handles both create and edit
 * Note: Password is not required for create (default password is set on backend)
 */
export function StudentForm({ studentSlug }: StudentFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!studentSlug

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const { 
    data: studentData, 
    isLoading: isLoadingStudent,
    isFetching: isFetchingStudent,
    dataUpdatedAt: studentDataUpdatedAt,
  } = useStudent(
    studentSlug || ''
  )

  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  // Select schema based on edit mode
  const studentFormSchema = useMemo(() => {
    return isEditMode ? updateStudentSchema : createStudentSchema
  }, [isEditMode])

  // Type for form data based on mode
  type StudentFormData = CreateStudentFormData | UpdateStudentFormData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'active',
      guardian_phone: '',
      age: undefined,
      gender: undefined,
      address: '',
      education: '',
      school_type: undefined,
      school_other: '',
      class: '',
      facebook_link: '',
    },
  })

  // Track the last dataUpdatedAt timestamp and studentSlug we used to populate the form
  const lastPopulatedRef = useRef<{ studentSlug: string; timestamp: number } | null>(null)
  
  // Populate form values when student data loads (edit mode)
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !studentSlug) {
      lastPopulatedRef.current = null
      return
    }
    
    // Wait for student data to be loaded
    if (isLoadingStudent || isFetchingStudent || !studentData?.data) return
    
    // Check if we need to populate
    const shouldPopulate = 
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.studentSlug !== studentSlug ||
      studentDataUpdatedAt > lastPopulatedRef.current.timestamp
    
    if (!shouldPopulate) return
    
    const student = studentData.data
    
    if (!student.user) {
      // If user is null, we can't populate the form
      return
    }
    
    // Reset form with all values at once using reset()
    reset({
      name: student.user.name || '',
      email: student.user.email || '',
      status: student.status || 'active',
      guardian_phone: student.guardian_phone || '',
      age: student.age || undefined,
      gender: student.user.gender || undefined,
      address: student.user.address || '',
      education: student.education || '',
      school_type: student.school_type || undefined,
      school_other: student.school_other || '',
      class: student.class || '',
      facebook_link: student.facebook_link || '',
    }, {
      keepDefaultValues: false,
    })
    
    // Update the last populated tracking
    lastPopulatedRef.current = {
      studentSlug,
      timestamp: studentDataUpdatedAt,
    }
  }, [isEditMode, studentSlug, studentData, isLoadingStudent, isFetchingStudent, studentDataUpdatedAt, reset])

  const onSubmit = async (data: StudentFormData) => {
    if (isEditMode && studentSlug) {
      const updateFormData = data as UpdateStudentFormData
      const updateData: UpdateStudentInput = {
        name: updateFormData.name,
        email: updateFormData.email,
        status: updateFormData.status,
        guardian_phone: updateFormData.guardian_phone,
        age: updateFormData.age,
        gender: updateFormData.gender,
        address: updateFormData.address,
        education: updateFormData.education || undefined,
        school_type: updateFormData.school_type || undefined,
        school_other: updateFormData.school_other || undefined,
        class: updateFormData.class || undefined,
        facebook_link: updateFormData.facebook_link || undefined,
      }
      updateStudent.mutate({ slug: studentSlug, data: updateData })
    } else {
      const createFormData = data as CreateStudentFormData
      const createData: CreateStudentInput = {
        name: createFormData.name,
        email: createFormData.email || '',
        status: createFormData.status,
        guardian_phone: createFormData.guardian_phone,
        age: createFormData.age ?? 0,
        gender: createFormData.gender || 'male',
        address: createFormData.address || '',
        education: createFormData.education || undefined,
        school_type: createFormData.school_type || undefined,
        school_other: createFormData.school_other || undefined,
        class: createFormData.class || undefined,
        facebook_link: createFormData.facebook_link || undefined,
      }
      createStudent.mutate(createData)
    }
  }

  if (isEditMode && isLoadingStudent) {
    return <FormSkeleton fieldsPerColumn={3} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t('student.pages.edit') : t('student.pages.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          key={isEditMode ? `student-form-${studentSlug}` : 'student-form-create'}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('student.form.name')}  <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={t('student.form.enterName')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('student.form.email')}  <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder={t('student.form.enterEmail')}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t('student.form.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder={t('student.form.enterPhone')}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">{t('student.form.gender')}  <span className="text-destructive">*</span></Label>
                <Select
                  value={watch('gender') || ''}
                  onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t('student.form.selectGender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('common.gender.male')}</SelectItem>
                    <SelectItem value="female">{t('common.gender.female')}</SelectItem>
                    <SelectItem value="other">{t('common.gender.other')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">{t('student.form.address')}</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder={t('student.form.enterAddress')}
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Guardian Phone */}
              <div className="space-y-2">
                <Label htmlFor="guardian_phone">{t('student.form.guardianPhone')}  <span className="text-destructive">*</span></Label>
                <Input
                  id="guardian_phone"
                  type="tel"
                  {...register('guardian_phone')}
                  placeholder={t('student.form.enterGuardianPhone')}
                  disabled={isSubmitting}
                />
                {errors.guardian_phone && (
                  <p className="text-sm text-destructive">{errors.guardian_phone.message}</p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">{t('student.form.age')}</Label>  <span className="text-destructive">*</span>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="150"
                  {...register('age', { valueAsNumber: true })}
                  placeholder={t('student.form.enterAge')}
                  disabled={isSubmitting}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age.message}</p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label htmlFor="education">{t('student.form.education')}</Label>
                <Input
                  id="education"
                  {...register('education')}
                  placeholder={t('student.form.enterEducation')}
                  disabled={isSubmitting}
                />
                {errors.education && (
                  <p className="text-sm text-destructive">{errors.education.message}</p>
                )}
              </div>

              {/* School Type */}
              <div className="space-y-2">
                <Label htmlFor="school_type">{t('student.form.schoolType')}</Label>
                <Select
                  value={watch('school_type') ?? ''}
                  onValueChange={(value) => setValue('school_type', value === '' ? undefined : value as 'government' | 'international' | 'private' | 'other')}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="school_type">
                    <SelectValue placeholder={t('student.form.selectSchoolType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">{t('student.form.schoolGovernment')}</SelectItem>
                    <SelectItem value="international">{t('student.form.schoolInternational')}</SelectItem>
                    <SelectItem value="private">{t('student.form.schoolPrivate')}</SelectItem>
                    <SelectItem value="other">{t('student.form.schoolOther')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School Other (when school type is Other) */}
              {watch('school_type') === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="school_other">{t('student.form.schoolOtherSpecify')}</Label>
                  <Input
                    id="school_other"
                    {...register('school_other')}
                    placeholder={t('student.form.enterSchoolOther')}
                    disabled={isSubmitting}
                  />
                  {errors.school_other && (
                    <p className="text-sm text-destructive">{errors.school_other.message}</p>
                  )}
                </div>
              )}

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">{t('student.form.class')}</Label>
                <Input
                  id="class"
                  {...register('class')}
                  placeholder={t('student.form.enterClass')}
                  disabled={isSubmitting}
                />
                {errors.class && (
                  <p className="text-sm text-destructive">{errors.class.message}</p>
                )}
              </div>

              {/* Facebook Link */}
              <div className="space-y-2">
                <Label htmlFor="facebook_link">{t('student.form.facebookLink')}</Label>
                <Input
                  id="facebook_link"
                  type="text"
                  {...register('facebook_link')}
                  placeholder={t('student.form.enterFacebookLink')}
                  disabled={isSubmitting}
                />
                {errors.facebook_link && (
                  <p className="text-sm text-destructive">{errors.facebook_link.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">{t('student.form.status')}</Label>
                <Select
                  value={watch('status') || 'active'}
                  onValueChange={(value) => setValue('status', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('student.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
                    <SelectItem value="inactive">{getStatusLabel('inactive')}</SelectItem>
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
              onClick={() => navigate('/students')}
              disabled={isSubmitting || createStudent.isPending || updateStudent.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('student.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting || createStudent.isPending || updateStudent.isPending}
            >
              {(isSubmitting || createStudent.isPending || updateStudent.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('student.messages.updating')
                    : t('student.messages.creating')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('student.actions.update')
                    : t('student.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

