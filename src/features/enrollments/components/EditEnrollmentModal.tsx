import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useEnrollment, useUpdateEnrollment } from '../hooks/useEnrollments'
import { useStudentsForEnrollmentPicker } from '@/features/students/hooks/useStudents'
import { updateEnrollmentSchema, type UpdateEnrollmentFormData } from '../schemas/enrollment.schemas'
import type { UpdateEnrollmentInput } from '../types/enrollment.types'
import { useTranslation } from '@/i18n/context'
import { Skeleton } from '@/components/ui/skeleton'

interface EditEnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enrollmentId: number | null
}

/**
 * EditEnrollmentModal - modal form to edit an existing enrollment.
 * Used on the course-enrollments page; stays on the page and refreshes the list on success.
 */
function EditEnrollmentModal({
  open,
  onOpenChange,
  enrollmentId,
}: EditEnrollmentModalProps) {
  const { t } = useTranslation()
  const updateEnrollment = useUpdateEnrollment(null) // No redirect; close modal and refresh list
  const lastPopulatedRef = useRef<{ enrollmentId: number; timestamp: number } | null>(null)

  const {
    data: enrollmentData,
    isLoading: isLoadingEnrollment,
    isFetching: isFetchingEnrollment,
    dataUpdatedAt: enrollmentDataUpdatedAt,
  } = useEnrollment(enrollmentId ?? 0)

  const { data: pickerData, isLoading: pickerLoading } = useStudentsForEnrollmentPicker({
    enabled: open && enrollmentId != null && enrollmentId > 0,
  })

  const studentOptions = useMemo(() => {
    return (
      pickerData?.data?.map((student) => ({
        value: String(student.id),
        label: `${student.name} (${student.student_id})`,
      })) ?? []
    )
  }, [pickerData?.data])

  const courseOptions = useMemo(() => {
    const e = enrollmentData?.data
    if (!e?.course) return []
    return [
      {
        value: String(e.course.id),
        label: `${e.course.title} (${e.course.subject.name})`,
      },
    ]
  }, [enrollmentData?.data])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEnrollmentFormData>({
    resolver: zodResolver(updateEnrollmentSchema),
    defaultValues: {
      student_id: undefined,
      course_id: undefined,
      enrolled_at: undefined,
      status: 'active',
    },
  })

  // Populate form when enrollment data loads
  useEffect(() => {
    if (!open || !enrollmentId || !enrollmentData?.data) return
    if (isLoadingEnrollment || isFetchingEnrollment) return

    const enrollment = enrollmentData.data
    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.enrollmentId !== enrollmentId ||
      enrollmentDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return
    if (!enrollment.student) return

    reset({
      student_id: enrollment.student.id,
      course_id: enrollment.course.id,
      enrolled_at: enrollment.enrolled_at || undefined,
      status: enrollment.status || 'active',
    }, { keepDefaultValues: false })

    lastPopulatedRef.current = { enrollmentId, timestamp: enrollmentDataUpdatedAt }
  }, [open, enrollmentId, enrollmentData, isLoadingEnrollment, isFetchingEnrollment, enrollmentDataUpdatedAt, reset])

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const onSubmit = (data: UpdateEnrollmentFormData) => {
    if (!enrollmentId) return
    const payload: UpdateEnrollmentInput = {
      student_id: data.student_id,
      course_id: data.course_id,
      enrolled_at: data.enrolled_at ?? null,
      status: data.status,
    }
    updateEnrollment.mutate(
      { id: enrollmentId, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const isLoading = isSubmitting || updateEnrollment.isPending || pickerLoading
  const showForm = open && enrollmentId && !isLoadingEnrollment && enrollmentData?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('enrollment.pages.edit')}</DialogTitle>
          <DialogDescription>{t('enrollment.descriptions.edit')}</DialogDescription>
        </DialogHeader>

        {isLoadingEnrollment && enrollmentId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={isLoading}
              />
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course_id">{t('enrollment.form.course')}</Label>
              <Combobox
                options={courseOptions}
                value={watch('course_id') ? String(watch('course_id')) : undefined}
                onValueChange={(value) => setValue('course_id', Number(value), { shouldValidate: true })}
                placeholder={t('enrollment.form.selectCourse')}
                searchPlaceholder={t('enrollment.form.searchCourse')}
                emptyText={t('enrollment.form.noCoursesFound')}
                disabled={true}
              />
              {errors.course_id && (
                <p className="text-sm text-destructive">{errors.course_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrolled_at">{t('enrollment.form.enrolledAt')}</Label>
              <Input
                id="enrolled_at"
                type="date"
                {...register('enrolled_at')}
                disabled={isLoading}
              />
              {errors.enrolled_at && (
                <p className="text-sm text-destructive">{errors.enrolled_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('enrollment.form.status')}</Label>
              <Select
                value={watch('status') || 'active'}
                onValueChange={(value) => setValue('status', value as 'active' | 'dropped' | 'completed')}
                disabled={isLoading}
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

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('enrollment.actions.cancel')}
              </Button>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('enrollment.messages.updating')}
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('enrollment.actions.update')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { EditEnrollmentModal }
