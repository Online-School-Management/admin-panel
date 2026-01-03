import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
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
import { useCreateCourse, useUpdateCourse, useCourse } from '../hooks/useCourses'
import { useSubjects } from '@/features/subjects/hooks/useSubjects'
import type { CreateCourseInput, UpdateCourseInput } from '../types/course.types'
import { createCourseSchema, updateCourseSchema, type CreateCourseFormData, type UpdateCourseFormData } from '../schemas/course.schemas'
import { COURSE_STATUS_OPTIONS, COURSE_STATUS, COURSE_TYPE_OPTIONS, COURSE_TYPE } from '@/constants'
import { useTranslation } from '@/i18n/context'

interface CourseFormProps {
  courseSlug?: string
}

/**
 * CourseForm component - handles both create and edit
 */
export function CourseForm({ courseSlug }: CourseFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isEditMode = !!courseSlug

  // Fetch subjects for dropdown
  const { data: subjectsData } = useSubjects({ per_page: 0 })

  const { 
    data: courseData, 
    isLoading: isLoadingCourse,
    isFetching: isFetchingCourse,
    dataUpdatedAt: courseDataUpdatedAt,
  } = useCourse(
    courseSlug || ''
  )

  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()

  // Select schema based on edit mode
  const courseFormSchema = useMemo(() => {
    return isEditMode ? updateCourseSchema : createCourseSchema
  }, [isEditMode])

  // Type for form data based on mode
  type CourseFormData = CreateCourseFormData | UpdateCourseFormData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      subject_id: undefined,
      title: '',
      duration_months: 3,
      monthly_fee: undefined,
      course_type: COURSE_TYPE.GROUP,
      status: COURSE_STATUS.UPCOMING,
      start_date: '',
      end_date: undefined,
    },
  })

  // Track the last dataUpdatedAt timestamp and courseSlug we used to populate the form
  const lastPopulatedRef = useRef<{ courseSlug: string; timestamp: number } | null>(null)
  
  // Populate form values when course data loads (edit mode)
  useEffect(() => {
    // Only proceed if we're in edit mode
    if (!isEditMode || !courseSlug) {
      lastPopulatedRef.current = null
      return
    }
    
    // Wait for course data to be loaded
    if (isLoadingCourse || isFetchingCourse || !courseData?.data) return
    
    // Check if we need to populate
    const shouldPopulate = 
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.courseSlug !== courseSlug ||
      courseDataUpdatedAt > lastPopulatedRef.current.timestamp
    
    if (!shouldPopulate) return
    
    const course = courseData.data
    
    // Reset form with all values at once using reset()
    reset({
      subject_id: course.subject.id,
      title: course.title || '',
      duration_months: course.duration_months || 3,
      monthly_fee: course.monthly_fee || undefined,
      course_type: course.course_type || COURSE_TYPE.GROUP,
      status: course.status || COURSE_STATUS.UPCOMING,
        start_date: course.start_date || '',
      end_date: course.end_date || undefined,
    }, {
      keepDefaultValues: false,
    })
    
    // Update the last populated tracking
    lastPopulatedRef.current = {
      courseSlug,
      timestamp: courseDataUpdatedAt,
    }
  }, [isEditMode, courseSlug, courseData, isLoadingCourse, isFetchingCourse, courseDataUpdatedAt, reset])

  const onSubmit = async (data: CourseFormData) => {
    if (isEditMode && courseSlug) {
      const updateFormData = data as UpdateCourseFormData
      const updateData: UpdateCourseInput = {
        subject_id: updateFormData.subject_id || undefined,
        title: updateFormData.title || undefined,
        duration_months: updateFormData.duration_months || undefined,
        monthly_fee: updateFormData.monthly_fee ?? undefined,
        course_type: updateFormData.course_type || undefined,
        status: updateFormData.status || undefined,
        start_date: updateFormData.start_date,
        end_date: updateFormData.end_date || undefined,
      }
      updateCourse.mutate({ slug: courseSlug, data: updateData })
    } else {
      const createFormData = data as CreateCourseFormData
      const createData: CreateCourseInput = {
        subject_id: createFormData.subject_id,
        title: createFormData.title,
        duration_months: createFormData.duration_months || undefined,
        monthly_fee: createFormData.monthly_fee ?? undefined,
        course_type: createFormData.course_type || undefined,
        status: createFormData.status || undefined,
        start_date: createFormData.start_date,
        end_date: createFormData.end_date || undefined,
      }
      createCourse.mutate(createData)
    }
  }

  const subjects = subjectsData?.data || []
  const selectedSubjectId = watch('subject_id')
  const selectedStatus = watch('status')

  if (isEditMode && isLoadingCourse) {
    return <FormSkeleton fieldsPerColumn={2} showActions={true} titleWidth="w-32" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t('course.pages.edit') : t('course.pages.create')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          key={isEditMode ? `course-form-${courseSlug}` : 'course-form-create'}
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject_id">
                  {t('course.form.subject')} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedSubjectId ? String(selectedSubjectId) : ''}
                  onValueChange={(value) => setValue('subject_id', Number(value), { shouldValidate: true })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="subject_id">
                    <SelectValue placeholder={t('course.form.selectSubject')} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject_id && (
                  <p className="text-sm text-destructive">{errors.subject_id.message}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t('course.form.title')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder={t('course.form.enterTitle')}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Duration Months */}
              <div className="space-y-2">
                <Label htmlFor="duration_months">{t('course.form.durationMonths')}</Label>
                <Input
                  id="duration_months"
                  type="number"
                  min="1"
                  max="120"
                  {...register('duration_months', { valueAsNumber: true })}
                  placeholder={t('course.form.enterDuration')}
                  disabled={isSubmitting}
                />
                {errors.duration_months && (
                  <p className="text-sm text-destructive">{errors.duration_months.message}</p>
                )}
              </div>

              {/* Monthly Fee */}
              <div className="space-y-2">
                <Label htmlFor="monthly_fee">{t('course.form.monthlyFee')}</Label>
                <Input
                  id="monthly_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('monthly_fee', { valueAsNumber: true })}
                  placeholder={t('course.form.enterMonthlyFee')}
                  disabled={isSubmitting}
                />
                {errors.monthly_fee && (
                  <p className="text-sm text-destructive">{errors.monthly_fee.message}</p>
                )}
              </div>

              {/* Course Type */}
              <div className="space-y-2">
                <Label htmlFor="course_type">{t('course.form.courseType')}</Label>
                <Select
                  value={watch('course_type') || COURSE_TYPE.GROUP}
                  onValueChange={(value) => setValue('course_type', value as typeof COURSE_TYPE.GROUP, { shouldValidate: true })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="course_type">
                    <SelectValue placeholder={t('course.form.selectCourseType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course_type && (
                  <p className="text-sm text-destructive">{errors.course_type.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">{t('course.form.status')}</Label>
                <Select
                  value={selectedStatus || ''}
                  onValueChange={(value) => setValue('status', value as typeof COURSE_STATUS.UPCOMING, { shouldValidate: true })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('course.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {t(`common.status.${status.value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  {t('course.form.startDate')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                  disabled={isSubmitting}
                  required
                />
                {errors.start_date && (
                  <p className="text-sm text-destructive">{errors.start_date.message}</p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end_date">{t('course.form.endDate')}</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                  disabled={isSubmitting}
                />
                {errors.end_date && (
                  <p className="text-sm text-destructive">{errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/courses')}
              disabled={isSubmitting || createCourse.isPending || updateCourse.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('course.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting || createCourse.isPending || updateCourse.isPending}
            >
              {(isSubmitting || createCourse.isPending || updateCourse.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode
                    ? t('course.messages.updating')
                    : t('course.messages.creating')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? t('course.actions.update')
                    : t('course.actions.create')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

