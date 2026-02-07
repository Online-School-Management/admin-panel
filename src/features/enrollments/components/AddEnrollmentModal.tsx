import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
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
import { useCreateEnrollment } from '../hooks/useEnrollments'
import { useStudents } from '@/features/students/hooks/useStudents'
import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/constants'
import type { CreateEnrollmentInput } from '../types/enrollment.types'
import { useTranslation } from '@/i18n/context'
import { useMemo } from 'react'

const addEnrollmentModalSchema = z
  .object({
    student_id: z.number().int().positive().optional(),
    enrolled_at: z.string().optional().nullable(),
    status: z.enum(['active', 'dropped', 'completed']).optional(),
  })
  .refine((data) => data.student_id != null && data.student_id > 0, {
    message: VALIDATION_MESSAGES.REQUIRED('Student'),
    path: ['student_id'],
  })

type AddEnrollmentModalFormData = z.infer<typeof addEnrollmentModalSchema>

interface AddEnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle?: string
}

/**
 * AddEnrollmentModal - modal form to add an enrollment to a specific course.
 * Used on the course-enrollments page; course is fixed, only student and optional fields are shown.
 */
export function AddEnrollmentModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
}: AddEnrollmentModalProps) {
  const { t } = useTranslation()
  const createEnrollment = useCreateEnrollment(null) // No redirect; close modal and refresh list

  const { data: studentsData } = useStudents({ per_page: 100 })

  const studentOptions = useMemo(() => {
    return studentsData?.data.map((student) => ({
      value: String(student.id),
      label: `${student.user?.name ?? ''} (${student.student_id})`,
    })) ?? []
  }, [studentsData?.data])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEnrollmentModalFormData>({
    resolver: zodResolver(addEnrollmentModalSchema),
    defaultValues: {
      student_id: undefined,
      enrolled_at: undefined,
      status: 'active',
    },
  })

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const onSubmit = (data: AddEnrollmentModalFormData) => {
    if (data.student_id == null) return
    const payload: CreateEnrollmentInput = {
      student_id: data.student_id,
      course_id: courseId,
      enrolled_at: data.enrolled_at || null,
      status: data.status || 'active',
    }
    createEnrollment.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
        reset()
      },
    })
  }

  const isLoading = isSubmitting || createEnrollment.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('enrollment.courseEnrollments.addEnrollment')}</DialogTitle>
          <DialogDescription>
            {courseTitle
              ? t('enrollment.courseGrid.description') + ` — ${courseTitle}`
              : t('enrollment.courseGrid.description')}
          </DialogDescription>
        </DialogHeader>
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
                  {t('enrollment.messages.creating')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('enrollment.actions.create')}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
