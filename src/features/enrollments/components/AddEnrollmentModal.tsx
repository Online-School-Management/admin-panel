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
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateEnrollment } from '../hooks/useEnrollments'
import { useStudents } from '@/features/students/hooks/useStudents'
import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/constants'
import type { CreateEnrollmentInput } from '../types/enrollment.types'
import { useTranslation } from '@/i18n/context'
import { useEffect, useMemo } from 'react'

const addEnrollmentModalSchema = z
  .object({
    student_id: z.number().int().positive().optional(),
    enrolled_at: z.string().optional().nullable(),
    status: z.enum(['active', 'dropped', 'completed']).optional(),
    first_n_months_free: z.number().int().min(0).max(255).optional(),
    discount_enabled: z.boolean().optional(),
    discount_type: z.enum(['percentage', 'fixed']).optional().nullable(),
    discount_value: z.number().min(0).max(999999.99).optional().nullable(),
  })
  .refine((data) => data.student_id != null && data.student_id > 0, {
    message: VALIDATION_MESSAGES.REQUIRED('Student'),
    path: ['student_id'],
  })
  .refine(
    (data) =>
      !data.discount_enabled || !data.discount_type || (data.discount_value != null && data.discount_value >= 0),
    { message: 'Discount value is required when discount type is set', path: ['discount_value'] }
  )

type AddEnrollmentModalFormData = z.infer<typeof addEnrollmentModalSchema>

interface AddEnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle?: string
  /** Course duration in months; used to show month checkboxes when Free is selected */
  courseDuration?: number
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
  courseDuration = 0,
}: AddEnrollmentModalProps) {
  const { t } = useTranslation()
  const createEnrollment = useCreateEnrollment(null) // No redirect; close modal and refresh list

  const { data: studentsData } = useStudents({ per_page: 1000 })

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
      first_n_months_free: 0,
      discount_enabled: false,
      discount_type: undefined,
      discount_value: undefined,
    },
  })

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const discountEnabled = watch('discount_enabled')
  const firstN = watch('first_n_months_free') ?? 0

  useEffect(() => {
    if (open) {
      reset({
        student_id: undefined,
        enrolled_at: undefined,
        status: 'active',
        first_n_months_free: 0,
        discount_enabled: false,
        discount_type: undefined,
        discount_value: undefined,
      })
    }
  }, [open, reset])

  const onSubmit = (data: AddEnrollmentModalFormData) => {
    if (data.student_id == null) return
    const payload: CreateEnrollmentInput = {
      student_id: data.student_id,
      course_id: courseId,
      enrolled_at: data.enrolled_at || null,
      status: data.status || 'active',
      first_n_months_free: data.first_n_months_free ?? 0,
      discount_type: data.discount_enabled ? (data.discount_type ?? null) : null,
      discount_value: data.discount_enabled ? (data.discount_value ?? null) : null,
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
      <DialogContent className="sm:max-w-2xl">
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

          <p className="text-sm text-muted-foreground">
            {t('enrollment.form.freeOrDiscountHint')}
          </p>

          {/* Free: checkbox + month checkboxes (mutually exclusive with Discount) */}
          {!discountEnabled && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="free_checkbox_modal"
                checked={firstN > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('first_n_months_free', 1, { shouldValidate: true })
                    setValue('discount_enabled', false)
                    setValue('discount_type', undefined)
                    setValue('discount_value', undefined)
                  } else {
                    setValue('first_n_months_free', 0, { shouldValidate: true })
                  }
                }}
                disabled={isLoading || courseDuration < 1}
              />
              <Label htmlFor="free_checkbox_modal" className="font-normal cursor-pointer">
                {t('enrollment.form.freeCheckbox')}
              </Label>
            </div>
            {firstN > 0 && courseDuration > 0 && (
              <div className="pl-6 space-y-2 border-l-2 border-muted">
                <p className="text-sm text-muted-foreground">{t('enrollment.form.selectFreeMonths')}</p>
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: courseDuration }, (_, i) => i + 1).map((monthNum) => (
                    <div key={monthNum} className="flex items-center space-x-2">
                      <Checkbox
                        id={`free_month_${monthNum}_modal`}
                        checked={firstN >= monthNum}
                        onCheckedChange={() => {
                          setValue(
                            'first_n_months_free',
                            firstN >= monthNum ? monthNum - 1 : monthNum,
                            { shouldValidate: true }
                          )
                        }}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={`free_month_${monthNum}_modal`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {t('studentPayment.monthNumber', { number: monthNum })}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Discount: checkbox + type/value (mutually exclusive with Free) */}
          {firstN === 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount_checkbox_modal"
                checked={discountEnabled ?? false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue('discount_enabled', true, { shouldValidate: true })
                    setValue('first_n_months_free', 0)
                  } else {
                    setValue('discount_enabled', false, { shouldValidate: true })
                    setValue('discount_type', undefined)
                    setValue('discount_value', undefined)
                  }
                }}
                disabled={isLoading}
              />
              <Label htmlFor="discount_checkbox_modal" className="font-normal cursor-pointer">
                {t('enrollment.form.discountCheckbox')}
              </Label>
            </div>
            {discountEnabled && (
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label>{t('enrollment.form.discountType')}</Label>
                  <Select
                    value={watch('discount_type') ?? 'none'}
                    onValueChange={(value) => {
                      const v = value === 'none' ? undefined : (value as 'percentage' | 'fixed')
                      setValue('discount_type', v, { shouldValidate: true })
                      if (v === undefined) setValue('discount_value', undefined)
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('enrollment.form.selectDiscountType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('enrollment.form.discountNone')}</SelectItem>
                      <SelectItem value="percentage">{t('enrollment.form.discountPercentage')}</SelectItem>
                      <SelectItem value="fixed">{t('enrollment.form.discountFixed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(watch('discount_type') === 'percentage' || watch('discount_type') === 'fixed') && (
                  <div className="space-y-2">
                    <Label htmlFor="discount_value_modal">
                      {watch('discount_type') === 'percentage'
                        ? t('enrollment.form.discountValuePercent')
                        : t('enrollment.form.discountValueFixed')}
                    </Label>
                    <Input
                      id="discount_value_modal"
                      type="number"
                      min={0}
                      step={watch('discount_type') === 'percentage' ? 1 : 0.01}
                      {...register('discount_value', { valueAsNumber: true })}
                      disabled={isLoading}
                    />
                    {errors.discount_value && (
                      <p className="text-sm text-destructive">{errors.discount_value.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          )}

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
