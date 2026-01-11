import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
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
import { Combobox } from '@/components/ui/combobox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSkeleton } from '@/components/common/skeletons/FormSkeleton'
import { useCreateEnrollment, useUpdateEnrollment, useEnrollment } from '../hooks/useEnrollments'
import { useStudents } from '@/features/students/hooks/useStudents'
import { useCourses } from '@/features/courses/hooks/useCourses'
import type { CreateEnrollmentInput, UpdateEnrollmentInput } from '../types/enrollment.types'
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  type CreateEnrollmentFormData,
  type UpdateEnrollmentFormData,
} from '../schemas/enrollment.schemas'
import { useTranslation } from '@/i18n/context'

interface EnrollmentFormProps {
  enrollmentId?: number
}

/**
 * EnrollmentForm component - handles both create and edit
 */
export function EnrollmentForm({ enrollmentId }: EnrollmentFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!enrollmentId

  const {
    data: enrollmentData,
    isLoading: isLoadingEnrollment,
    isFetching: isFetchingEnrollment,
    dataUpdatedAt: enrollmentDataUpdatedAt,
  } = useEnrollment(enrollmentId || 0)

  const createEnrollment = useCreateEnrollment()
  const updateEnrollment = useUpdateEnrollment()

  // Fetch students and courses for dropdowns
  const { data: studentsData } = useStudents({ per_page: 100 })
  const { data: coursesData } = useCourses({ per_page: 100 })

  // Create options for comboboxes
  const studentOptions = useMemo(() => {
    return studentsData?.data.map((student) => ({
      value: String(student.id),
      label: `${student.user.name} (${student.student_id})`,
    })) || []
  }, [studentsData?.data])

  const courseOptions = useMemo(() => {
    return coursesData?.data.map((course) => ({
      value: String(course.id),
      label: `${course.title} (${course.subject.name})`,
    })) || []
  }, [coursesData?.data])

  // Select schema based on edit mode
  const enrollmentFormSchema = useMemo(() => {
    return isEditMode ? updateEnrollmentSchema : createEnrollmentSchema
  }, [isEditMode])

  // Type for form data based on mode
  type EnrollmentFormData = CreateEnrollmentFormData | UpdateEnrollmentFormData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      student_id: undefined,
      course_id: undefined,
      enrolled_at: undefined,
      status: 'active',
    },
  })

  // Track the last dataUpdatedAt timestamp and enrollmentId we used to populate the form
  const lastPopulatedRef = useRef<{ enrollmentId: number; timestamp: number } | null>(null)

  // Populate form values when enrollment data loads (edit mode)
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !enrollmentId) {
      lastPopulatedRef.current = null
      return
    }

    // Wait for enrollment data to be loaded
    if (isLoadingEnrollment || isFetchingEnrollment || !enrollmentData?.data) return

    // Check if we need to populate
    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.enrollmentId !== enrollmentId ||
      enrollmentDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    const enrollment = enrollmentData.data

    // Reset form with all values at once using reset()
    // Handle case where student might be deleted
    if (!enrollment.student) {
      // If student is deleted, we can't edit the enrollment
      // This should ideally be handled by the backend, but we'll show an error
      console.error('Cannot edit enrollment: student has been deleted')
      return
    }

    reset({
      student_id: enrollment.student.id,
      course_id: enrollment.course.id,
      enrolled_at: enrollment.enrolled_at || undefined,
      status: enrollment.status || 'active',
    }, {
      keepDefaultValues: false,
    })

    // Update the last populated tracking
    lastPopulatedRef.current = {
      enrollmentId,
      timestamp: enrollmentDataUpdatedAt,
    }
  }, [isEditMode, enrollmentId, enrollmentData, isLoadingEnrollment, isFetchingEnrollment, enrollmentDataUpdatedAt, reset])

  const onSubmit = async (data: EnrollmentFormData) => {
    if (isEditMode && enrollmentId) {
      const updateFormData = data as UpdateEnrollmentFormData
      const updateData: UpdateEnrollmentInput = {
        student_id: updateFormData.student_id,
        course_id: updateFormData.course_id,
        enrolled_at: updateFormData.enrolled_at || null,
        status: updateFormData.status,
      }
      updateEnrollment.mutate({ id: enrollmentId, data: updateData })
    } else {
      const createFormData = data as CreateEnrollmentFormData
      const createData: CreateEnrollmentInput = {
        student_id: createFormData.student_id,
        course_id: createFormData.course_id,
        enrolled_at: createFormData.enrolled_at || null,
        status: createFormData.status || 'active',
      }
      createEnrollment.mutate(createData)
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  if (isEditMode && isLoadingEnrollment) {
    return <FormSkeleton fieldsPerColumn={2} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? t('enrollment.pages.edit') : t('enrollment.pages.create')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          key={isEditMode ? `enrollment-form-${enrollmentId}` : 'enrollment-form-create'}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Student */}
              <div className="space-y-2">
                <Label htmlFor="student_id">
                  {t('enrollment.form.student')} <span className="text-destructive">*</span>
                </Label>
                <Combobox
                  options={studentOptions}
                  value={watch('student_id') ? String(watch('student_id')) : undefined}
                  onValueChange={(value) => setValue('student_id', Number(value), { shouldValidate: true })}
                  placeholder={t('enrollment.form.selectStudent')}
                  searchPlaceholder={t('enrollment.form.searchStudent')}
                  emptyText={t('enrollment.form.noStudentsFound')}
                  disabled={isSubmitting}
                />
                {errors.student_id && (
                  <p className="text-sm text-destructive">{errors.student_id.message}</p>
                )}
              </div>

              {/* Enrolled At */}
              <div className="space-y-2">
                <Label htmlFor="enrolled_at">{t('enrollment.form.enrolledAt')}</Label>
                <Input
                  id="enrolled_at"
                  type="date"
                  {...register('enrolled_at')}
                  disabled={isSubmitting}
                />
                {errors.enrolled_at && (
                  <p className="text-sm text-destructive">{errors.enrolled_at.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Course */}
              <div className="space-y-2">
                <Label htmlFor="course_id">
                  {t('enrollment.form.course')} <span className="text-destructive">*</span>
                </Label>
                <Combobox
                  options={courseOptions}
                  value={watch('course_id') ? String(watch('course_id')) : undefined}
                  onValueChange={(value) => setValue('course_id', Number(value), { shouldValidate: true })}
                  placeholder={t('enrollment.form.selectCourse')}
                  searchPlaceholder={t('enrollment.form.searchCourse')}
                  emptyText={t('enrollment.form.noCoursesFound')}
                  disabled={isSubmitting}
                />
                {errors.course_id && (
                  <p className="text-sm text-destructive">{errors.course_id.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">{t('enrollment.form.status')}</Label>
                <Select
                  value={watch('status') || 'active'}
                  onValueChange={(value) => setValue('status', value as 'active' | 'dropped' | 'completed')}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('enrollment.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
                    <SelectItem value="dropped">{getStatusLabel('dropped')}</SelectItem>
                    <SelectItem value="completed">{getStatusLabel('completed')}</SelectItem>
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
              onClick={() => navigate('/enrollments')}
              disabled={isSubmitting || createEnrollment.isPending || updateEnrollment.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('enrollment.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting || createEnrollment.isPending || updateEnrollment.isPending}
            >
              {(isSubmitting || createEnrollment.isPending || updateEnrollment.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('enrollment.messages.updating')
                    : t('enrollment.messages.creating')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('enrollment.actions.update')
                    : t('enrollment.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

