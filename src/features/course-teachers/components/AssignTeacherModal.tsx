import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Loader2, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useTeachers } from '@/features/teachers/hooks/useTeachers'
import { formatCurrency } from '@/utils/format'
import {
  useCourseTeachersByCourse,
  useCreateCourseTeacher,
  useUpdateCourseTeacher,
  useDeleteCourseTeacher,
} from '../hooks/useCourseTeachers'
import { useTranslation } from '@/i18n/context'
import type { TeacherCollectionItem } from '@/features/teachers/types/teacher.types'
import { useToast } from '@/hooks/use-toast'

const assignTeacherSchema = z.object({
  teacher_id: z.number().int().positive('Please select a teacher'),
  commission_type: z
    .enum(['monthly_percent', 'monthly_salary', 'per_session', 'fixed_amount'])
    .optional(),
  commission_rate: z
    .number()
    .min(0, 'Commission rate must be at least 0')
    .max(99, 'Commission rate cannot exceed 99')
    .nullable()
    .optional()
    .or(z.null()),
  monthly_salary_amount: z
    .number()
    .min(0, 'Monthly salary must be at least 0')
    .nullable()
    .optional()
    .or(z.null()),
  per_session_amount: z
    .number()
    .min(0, 'Per session amount must be at least 0')
    .nullable()
    .optional()
    .or(z.null()),
  fixed_amount: z
    .number()
    .min(0, 'Fixed amount must be at least 0')
    .nullable()
    .optional()
    .or(z.null()),
})

type AssignTeacherFormData = z.infer<typeof assignTeacherSchema>

interface AssignTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle: string
}

/**
 * Helper to get a human-readable compensation summary for a teacher or assignment
 */
function getCompensationSummary(
  commissionType: string | null | undefined,
  commissionRate: number | null | undefined,
  monthlySalaryAmount: number | null | undefined,
  perSessionAmount: number | null | undefined,
  fixedAmount: number | null | undefined,
  tFn: (key: string) => string,
): string | null {
  switch (commissionType) {
    case 'monthly_percent':
      return commissionRate != null
        ? `${tFn('teacher.commissionType.monthly_percent')}: ${commissionRate.toFixed(2)}%`
        : tFn('teacher.commissionType.monthly_percent')
    case 'monthly_salary':
      return monthlySalaryAmount != null
        ? `${tFn('teacher.commissionType.monthly_salary')}: ${formatCurrency(Number(monthlySalaryAmount))}`
        : tFn('teacher.commissionType.monthly_salary')
    case 'per_session':
      return perSessionAmount != null
        ? `${tFn('teacher.commissionType.per_session')}: ${formatCurrency(Number(perSessionAmount))}`
        : tFn('teacher.commissionType.per_session')
    case 'fixed_amount':
      return fixedAmount != null
        ? `${tFn('teacher.commissionType.fixed_amount')}: ${formatCurrency(Number(fixedAmount))}`
        : tFn('teacher.commissionType.fixed_amount')
    default:
      return null
  }
}

/**
 * AssignTeacherModal component - modal for assigning teachers to courses
 */
export function AssignTeacherModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
}: AssignTeacherModalProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [useDefault, setUseDefault] = useState(true)

  // Fetch teachers for dropdown
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers({
    per_page: 0,
    status: 'active',
  })

  // Fetch existing assignments for this course
  const { data: assignmentsData, isLoading: isLoadingAssignments, refetch: refetchAssignments } =
    useCourseTeachersByCourse(courseId)

  const createAssignment = useCreateCourseTeacher()
  const updateAssignment = useUpdateCourseTeacher()
  const deleteAssignment = useDeleteCourseTeacher()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignTeacherFormData>({
    resolver: zodResolver(assignTeacherSchema),
    defaultValues: {
      teacher_id: undefined as any,
      commission_type: 'monthly_percent',
      commission_rate: null,
      monthly_salary_amount: null,
      per_session_amount: null,
      fixed_amount: null,
    },
  })

  const selectedTeacherId = watch('teacher_id')
  const selectedCommissionType = watch('commission_type')
  const teachers = teachersData?.data || []
  const assignments = assignmentsData?.data || []

  // Check if a teacher is already assigned to this course (only one allowed)
  const hasExistingAssignment = assignments.length > 0
  const existingAssignment = assignments[0] || null

  // Find the selected teacher's data to show defaults
  const selectedTeacher: TeacherCollectionItem | undefined = useMemo(() => {
    if (!selectedTeacherId) return undefined
    return teachers.find((t) => t.id === selectedTeacherId)
  }, [selectedTeacherId, teachers])

  // Get the selected teacher's default compensation display
  const teacherDefaultDisplay = useMemo(() => {
    if (!selectedTeacher) return null
    return getCompensationSummary(
      selectedTeacher.commission_type,
      selectedTeacher.commission_rate,
      selectedTeacher.monthly_salary_amount,
      selectedTeacher.per_session_amount,
      undefined,
      t,
    )
  }, [selectedTeacher, t])

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (!open) {
      reset()
      setEditingId(null)
      setUseDefault(true)
    } else {
      refetchAssignments()
      if (editingId && existingAssignment) {
        setValue('teacher_id', existingAssignment.teacher.id)
        setValue('commission_type', existingAssignment.commission_type || 'monthly_percent')
        setValue('commission_rate', existingAssignment.commission_rate ?? null)
        setValue('monthly_salary_amount', existingAssignment.monthly_salary_amount ?? null)
        setValue('per_session_amount', existingAssignment.per_session_amount ?? null)
        setValue('fixed_amount', existingAssignment.fixed_amount ?? null)
        // In edit mode, default to "use default" = true (admin can uncheck to override)
        setUseDefault(true)
      } else {
        reset()
        setUseDefault(true)
      }
    }
  }, [open, editingId, existingAssignment, reset, setValue, refetchAssignments])

  const onSubmit = async (data: AssignTeacherFormData) => {
    // If "use default" is checked, don't send compensation fields – backend will copy teacher defaults
    const compensationPayload: Record<string, any> = {}

    if (!useDefault) {
      const commissionType = data.commission_type || 'monthly_percent'
      if (commissionType === 'fixed_amount' && (data.fixed_amount == null || data.fixed_amount === undefined)) {
        toast({
          title: t('courseTeacher.modal.fixedAmount'),
          description: t('courseTeacher.modal.enterFixedAmount'),
          variant: 'destructive',
        })
        return
      }
      compensationPayload.commission_type = commissionType
      switch (commissionType) {
        case 'monthly_percent':
          compensationPayload.commission_rate = data.commission_rate ?? null
          compensationPayload.monthly_salary_amount = null
          compensationPayload.per_session_amount = null
          compensationPayload.fixed_amount = null
          break
        case 'monthly_salary':
          compensationPayload.commission_rate = null
          compensationPayload.monthly_salary_amount = data.monthly_salary_amount ?? null
          compensationPayload.per_session_amount = null
          compensationPayload.fixed_amount = null
          break
        case 'per_session':
          compensationPayload.commission_rate = null
          compensationPayload.monthly_salary_amount = null
          compensationPayload.per_session_amount = data.per_session_amount ?? null
          compensationPayload.fixed_amount = null
          break
        case 'fixed_amount':
          compensationPayload.commission_rate = null
          compensationPayload.monthly_salary_amount = null
          compensationPayload.per_session_amount = null
          compensationPayload.fixed_amount = data.fixed_amount ?? null
          break
      }
    }

    if (editingId) {
      const oldTeacherId = existingAssignment?.teacher.id
      const newTeacherId = data.teacher_id
      if (oldTeacherId && newTeacherId !== oldTeacherId) {
        const oldName = existingAssignment?.teacher.user.name ?? ''
        const newName = teachers.find((teacher) => teacher.id === newTeacherId)?.user.name ?? ''
        if (
          !window.confirm(
            t('courseTeacher.modal.confirmReplaceTeacher', { oldName, newName })
          )
        ) {
          return
        }
      }

      updateAssignment.mutate(
        {
          id: editingId,
          data: {
            teacher_id: data.teacher_id,
            ...compensationPayload,
          },
        },
        {
          onSuccess: () => {
            reset()
            setEditingId(null)
            setUseDefault(true)
          },
        }
      )
    } else {
      if (!hasExistingAssignment) {
        createAssignment.mutate(
          {
            course_id: courseId,
            teacher_id: data.teacher_id,
            ...compensationPayload,
          },
          {
            onSuccess: () => {
              reset()
              setUseDefault(true)
            },
          }
        )
      }
    }
  }

  const handleEdit = (assignmentId: number) => {
    setEditingId(assignmentId)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setUseDefault(true)
    reset()
  }

  const handleDelete = (assignmentId: number) => {
    if (window.confirm(t('courseTeacher.modal.confirmDelete'))) {
      deleteAssignment.mutate(assignmentId, {
        onSuccess: () => {
          refetchAssignments()
        },
      })
    }
  }

  // Shared compensation section: shows default info or editable override fields
  const renderCompensationSection = (idPrefix: string) => (
    <div className="space-y-4">
      {/* Teacher's Default Compensation Display (only when a teacher is selected) */}
      {selectedTeacher && (
        <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
          <p className="text-sm font-medium">{t('courseTeacher.modal.teacherDefault')}</p>
          <Badge variant="secondary">
            {teacherDefaultDisplay || t('courseTeacher.modal.noDefaultSet')}
          </Badge>
        </div>
      )}

      {/* Use Default Toggle */}
      {selectedTeacher && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}_use_default`}
            checked={useDefault}
            onCheckedChange={(checked) => {
              setUseDefault(checked === true)
              // When switching to override, pre-fill with teacher's current defaults
              if (checked === false && selectedTeacher) {
                setValue('commission_type', selectedTeacher.commission_type || 'monthly_percent')
                setValue('commission_rate', selectedTeacher.commission_rate ?? null)
                setValue('monthly_salary_amount', selectedTeacher.monthly_salary_amount ?? null)
                setValue('per_session_amount', selectedTeacher.per_session_amount ?? null)
                setValue('fixed_amount', null)
              }
            }}
            disabled={isSubmitting}
          />
          <Label
            htmlFor={`${idPrefix}_use_default`}
            className="text-sm font-medium leading-none cursor-pointer"
          >
            {t('courseTeacher.modal.useDefault')}
          </Label>
        </div>
      )}

      {/* Override Fields (only when useDefault is unchecked and teacher selected) */}
      {selectedTeacher && !useDefault && (
        <div className="space-y-4 pl-1 border-l-2 border-primary/20 ml-1">
          <div className="pl-3 space-y-4">
            {/* Commission Type */}
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}_commission_type`}>
                {t('courseTeacher.modal.commissionType')}
              </Label>
              <Select
                value={selectedCommissionType || 'monthly_percent'}
                onValueChange={(value) => setValue('commission_type', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`${idPrefix}_commission_type`}>
                  <SelectValue placeholder={t('courseTeacher.modal.selectCommissionType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly_percent">{t('teacher.commissionType.monthly_percent')}</SelectItem>
                  <SelectItem value="monthly_salary">{t('teacher.commissionType.monthly_salary')}</SelectItem>
                  <SelectItem value="per_session">{t('teacher.commissionType.per_session')}</SelectItem>
                  <SelectItem value="fixed_amount">{t('teacher.commissionType.fixed_amount')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Commission Rate (only for monthly_percent) */}
            {selectedCommissionType === 'monthly_percent' && (
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}_commission_rate`}>
                  {t('courseTeacher.modal.commissionRate')} (%)
                </Label>
                <Input
                  id={`${idPrefix}_commission_rate`}
                  type="number"
                  step="0.01"
                  min="0"
                  max="99"
                  {...register('commission_rate', {
                    setValueAs: (v) => v === '' || v === null || v === undefined ? null : (isNaN(Number(v)) ? null : Number(v))
                  })}
                  placeholder={t('courseTeacher.modal.enterCommissionRate')}
                  disabled={isSubmitting}
                />
                {errors.commission_rate && (
                  <p className="text-sm text-destructive">{errors.commission_rate.message}</p>
                )}
              </div>
            )}

            {/* Monthly Salary Amount (only for monthly_salary) */}
            {selectedCommissionType === 'monthly_salary' && (
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}_monthly_salary_amount`}>
                  {t('courseTeacher.modal.monthlySalaryAmount')}
                </Label>
                <Input
                  id={`${idPrefix}_monthly_salary_amount`}
                  type="number"
                  step="1"
                  min="0"
                  {...register('monthly_salary_amount', {
                    setValueAs: (v) => v === '' || v === null || v === undefined ? null : (isNaN(Number(v)) ? null : Number(v))
                  })}
                  placeholder={t('courseTeacher.modal.enterMonthlySalaryAmount')}
                  disabled={isSubmitting}
                />
                {errors.monthly_salary_amount && (
                  <p className="text-sm text-destructive">{errors.monthly_salary_amount.message}</p>
                )}
              </div>
            )}

            {/* Per Session Amount (only for per_session) */}
            {selectedCommissionType === 'per_session' && (
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}_per_session_amount`}>
                  {t('courseTeacher.modal.perSessionAmount')}
                </Label>
                <Input
                  id={`${idPrefix}_per_session_amount`}
                  type="number"
                  step="1"
                  min="0"
                  {...register('per_session_amount', {
                    setValueAs: (v) => v === '' || v === null || v === undefined ? null : (isNaN(Number(v)) ? null : Number(v))
                  })}
                  placeholder={t('courseTeacher.modal.enterPerSessionAmount')}
                  disabled={isSubmitting}
                />
                {errors.per_session_amount && (
                  <p className="text-sm text-destructive">{errors.per_session_amount.message}</p>
                )}
              </div>
            )}

            {selectedCommissionType === 'fixed_amount' && (
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}_fixed_amount`}>
                  {t('courseTeacher.modal.fixedAmount')}
                </Label>
                <Input
                  id={`${idPrefix}_fixed_amount`}
                  type="number"
                  step="1"
                  min="0"
                  {...register('fixed_amount', {
                    setValueAs: (v) => v === '' || v === null || v === undefined ? null : (isNaN(Number(v)) ? null : Number(v))
                  })}
                  placeholder={t('courseTeacher.modal.enterFixedAmount')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">{t('courseTeacher.modal.fixedAmountHint')}</p>
                {errors.fixed_amount && (
                  <p className="text-sm text-destructive">{errors.fixed_amount.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('courseTeacher.modal.title', { courseTitle })}</DialogTitle>
          <DialogDescription>{t('courseTeacher.modal.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Assignment (Only one teacher allowed) - Hide when editing */}
          {!editingId && (
            <>
              {isLoadingAssignments ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : hasExistingAssignment && existingAssignment ? (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    {t('courseTeacher.modal.assignedTeacher')}
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{existingAssignment.teacher.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {existingAssignment.teacher.user.email}
                        </p>
                        {getCompensationSummary(
                          existingAssignment.commission_type,
                          existingAssignment.commission_rate,
                          existingAssignment.monthly_salary_amount,
                          existingAssignment.per_session_amount,
                          existingAssignment.fixed_amount,
                          t,
                        ) && (
                          <Badge variant="outline" className="mt-1">
                            {getCompensationSummary(
                              existingAssignment.commission_type,
                              existingAssignment.commission_rate,
                              existingAssignment.monthly_salary_amount,
                              existingAssignment.per_session_amount,
                              existingAssignment.fixed_amount,
                              t,
                            )}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(existingAssignment.id)}
                          disabled={isSubmitting || editingId !== null}
                        >
                          {t('courseTeacher.modal.changeTeacher')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(existingAssignment.id)}
                          disabled={isSubmitting || deleteAssignment.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Add Form (Only show if no teacher is assigned) */}
          {!hasExistingAssignment && !editingId && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher_id">
                  {t('courseTeacher.modal.selectTeacher')}{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedTeacherId ? String(selectedTeacherId) : ''}
                  onValueChange={(value) => {
                    setValue('teacher_id', Number(value), { shouldValidate: true })
                    setUseDefault(true)
                  }}
                  disabled={isSubmitting || isLoadingTeachers}
                >
                  <SelectTrigger id="teacher_id">
                    <SelectValue placeholder={t('courseTeacher.modal.chooseTeacher')} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={String(teacher.id)}>
                        {teacher.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teacher_id && (
                  <p className="text-sm text-destructive">{errors.teacher_id.message}</p>
                )}
              </div>

              {renderCompensationSection('create')}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false)
                    reset()
                    setEditingId(null)
                    setUseDefault(true)
                  }}
                  disabled={isSubmitting}
                >
                  {t('courseTeacher.modal.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting || createAssignment.isPending}>
                  {(isSubmitting || createAssignment.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('courseTeacher.modal.assigning')}
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {t('courseTeacher.modal.assign')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Edit Form (when editing existing assignment - allows changing teacher) */}
          {editingId && hasExistingAssignment && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_teacher_id">
                  {t('courseTeacher.modal.selectTeacher')}{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedTeacherId ? String(selectedTeacherId) : ''}
                  onValueChange={(value) => {
                    setValue('teacher_id', Number(value), { shouldValidate: true })
                    setUseDefault(true)
                  }}
                  disabled={isSubmitting || isLoadingTeachers}
                >
                  <SelectTrigger id="edit_teacher_id">
                    <SelectValue placeholder={t('courseTeacher.modal.chooseTeacher')} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={String(teacher.id)}>
                        {teacher.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teacher_id && (
                  <p className="text-sm text-destructive">{errors.teacher_id.message}</p>
                )}
              </div>

              {renderCompensationSection('edit')}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  {t('courseTeacher.modal.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting || updateAssignment.isPending}>
                  {(isSubmitting || updateAssignment.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('courseTeacher.modal.updating')}
                    </>
                  ) : (
                    t('courseTeacher.modal.update')
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
