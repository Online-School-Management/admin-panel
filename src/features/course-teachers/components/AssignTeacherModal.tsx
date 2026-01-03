import { useState, useEffect } from 'react'
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
import { useTeachers } from '@/features/teachers/hooks/useTeachers'
import {
  useCourseTeachersByCourse,
  useCreateCourseTeacher,
  useUpdateCourseTeacher,
  useDeleteCourseTeacher,
} from '../hooks/useCourseTeachers'
import { useTranslation } from '@/i18n/context'

const assignTeacherSchema = z.object({
  teacher_id: z.number().int().positive('Please select a teacher'),
  commission_rate: z
    .number()
    .min(0, 'Commission rate must be at least 0')
    .max(99, 'Commission rate cannot exceed 99')
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
 * AssignTeacherModal component - modal for assigning teachers to courses
 */
export function AssignTeacherModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
}: AssignTeacherModalProps) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<number | null>(null)

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
      commission_rate: null,
    },
  })

  const selectedTeacherId = watch('teacher_id')
  const teachers = teachersData?.data || []
  const assignments = assignmentsData?.data || []
  
  // Check if a teacher is already assigned to this course (only one allowed)
  const hasExistingAssignment = assignments.length > 0
  const existingAssignment = assignments[0] || null

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (!open) {
      reset()
      setEditingId(null)
    } else {
      // When modal opens, refetch assignments to ensure fresh data
      refetchAssignments()
      if (editingId && existingAssignment) {
        // When editing, populate form with existing assignment data
        setValue('teacher_id', existingAssignment.teacher.id)
        setValue('commission_rate', existingAssignment.commission_rate || undefined)
      } else {
        reset()
      }
    }
  }, [open, editingId, existingAssignment, reset, setValue, refetchAssignments])

  const onSubmit = async (data: AssignTeacherFormData) => {
    if (editingId) {
      // Update existing assignment (can change teacher or commission rate)
      const updateData: any = {
        teacher_id: data.teacher_id,
      }
      // Only include commission_rate if it's provided (not null/undefined)
      if (data.commission_rate !== null && data.commission_rate !== undefined) {
        updateData.commission_rate = data.commission_rate
      } else {
        // If not provided, set to null so backend can use teacher's default
        updateData.commission_rate = null
      }
      
      updateAssignment.mutate(
        {
          id: editingId,
          data: updateData,
        },
        {
          onSuccess: () => {
            reset()
            setEditingId(null)
          },
        }
      )
    } else {
      // Create new assignment (only if no teacher is assigned)
      if (!hasExistingAssignment) {
        const createData: any = {
          course_id: courseId,
          teacher_id: data.teacher_id,
        }
        // Only include commission_rate if it's provided (not null/undefined)
        if (data.commission_rate !== null && data.commission_rate !== undefined) {
          createData.commission_rate = data.commission_rate
        }
        // If not provided, don't send it - backend will use teacher's default
        
        createAssignment.mutate(
          createData,
          {
            onSuccess: () => {
              reset()
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
    reset()
  }

  const handleDelete = (assignmentId: number) => {
    if (window.confirm(t('courseTeacher.modal.confirmDelete'))) {
      deleteAssignment.mutate(assignmentId, {
        onSuccess: () => {
          // Refetch the course-specific assignments to ensure fresh data
          refetchAssignments()
        },
      })
    }
  }

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
                        {existingAssignment.commission_rate !== null && (
                          <Badge variant="outline" className="mt-1">
                            {t('courseTeacher.modal.commissionRate')}:{' '}
                            {existingAssignment.commission_rate.toFixed(2)}%
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

              <div className="space-y-2">
                <Label htmlFor="commission_rate">
                  {t('courseTeacher.modal.commissionRate')} (%)
                  <span className="text-muted-foreground text-sm ml-2">
                    ({t('courseTeacher.modal.optional')})
                  </span>
                </Label>
                <Input
                  id="commission_rate"
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
                <p className="text-xs text-muted-foreground">
                  {t('courseTeacher.modal.commissionHint')}
                </p>
                {errors.commission_rate && (
                  <p className="text-sm text-destructive">
                    {errors.commission_rate.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false)
                    reset()
                    setEditingId(null)
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

              <div className="space-y-2">
                <Label htmlFor="edit_commission_rate">
                  {t('courseTeacher.modal.commissionRate')} (%)
                  <span className="text-muted-foreground text-sm ml-2">
                    ({t('courseTeacher.modal.optional')})
                  </span>
                </Label>
                <Input
                  id="edit_commission_rate"
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
                <p className="text-xs text-muted-foreground">
                  {t('courseTeacher.modal.commissionHint')}
                </p>
                {errors.commission_rate && (
                  <p className="text-sm text-destructive">
                    {errors.commission_rate.message}
                  </p>
                )}
              </div>

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

