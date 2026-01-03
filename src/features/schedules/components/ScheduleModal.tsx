import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Loader2, Trash2, Edit, AlertCircle, Plus } from 'lucide-react'
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
import {
  useSchedulesByCourse,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from '../hooks/useSchedules'
import { createScheduleSchema, type CreateScheduleFormData } from '../schemas/schedule.schemas'
import { useTranslation } from '@/i18n/context'

const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
] as const

/**
 * Convert 24-hour time format (HH:mm) to 12-hour format with AM/PM
 */
function formatTimeTo12Hour(time24: string): string {
  if (!time24) return time24
  
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  
  return `${hours12}:${minutesStr} ${period}`
}

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle: string
  assignedTeacher: {
    id: number
    name: string
    email?: string
    commission_rate: number | null
  } | null
}

/**
 * ScheduleModal component - modal for managing schedules for a course
 */
export function ScheduleModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
  assignedTeacher,
}: ScheduleModalProps) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Fetch existing schedules for this course
  const {
    data: schedulesData,
    isLoading: isLoadingSchedules,
    isFetching: isFetchingSchedules,
    refetch: refetchSchedules,
  } = useSchedulesByCourse(courseId)

  const createSchedule = useCreateSchedule()
  const updateSchedule = useUpdateSchedule()
  const deleteSchedule = useDeleteSchedule()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      course_id: courseId,
      teacher_id: undefined as any,
      day_of_week: undefined as any,
      start_time: '',
      end_time: '',
      room_or_link: null,
    },
  })

  const selectedDayOfWeek = watch('day_of_week')
  const schedules = schedulesData?.data || []

  // Reset form when modal opens/closes or when editing changes
  useEffect(() => {
    if (!open) {
      reset()
      setEditingId(null)
      setShowAddForm(false)
    } else {
      // When modal opens, refetch schedules to ensure fresh data
      refetchSchedules()
      if (editingId) {
        const scheduleToEdit = schedules.find((s) => s.id === editingId)
        if (scheduleToEdit) {
          // When editing, use the teacher from the schedule (should be the assigned teacher)
          setValue('teacher_id', scheduleToEdit.teacher.id)
          setValue('day_of_week', scheduleToEdit.day_of_week)
          setValue('start_time', scheduleToEdit.start_time)
          setValue('end_time', scheduleToEdit.end_time)
          setValue('room_or_link', scheduleToEdit.room_or_link || null)
        }
      } else {
        reset()
        setValue('course_id', courseId)
        // Automatically set teacher_id from assigned teacher
        if (assignedTeacher) {
          setValue('teacher_id', assignedTeacher.id)
        }
      }
    }
  }, [open, editingId, schedules, reset, setValue, refetchSchedules, courseId, assignedTeacher])

  const onSubmit = async (data: CreateScheduleFormData) => {
    // Ensure teacher_id is set (should always be from assignedTeacher)
    const teacherId = assignedTeacher?.id
    if (!teacherId) {
      return // Should not happen if validation works correctly
    }

    if (editingId) {
      // Update existing schedule
      updateSchedule.mutate(
        {
          id: editingId,
          data: {
            teacher_id: teacherId,
            day_of_week: data.day_of_week,
            start_time: data.start_time,
            end_time: data.end_time,
            room_or_link: data.room_or_link || null,
          },
        },
        {
          onSuccess: async () => {
            // Refetch schedules to get updated data
            await refetchSchedules()
            reset()
            setEditingId(null)
            setShowAddForm(false)
            if (assignedTeacher) {
              setValue('teacher_id', assignedTeacher.id)
            }
          },
        }
      )
    } else {
      // Create new schedule
      createSchedule.mutate(
        {
          course_id: courseId,
          teacher_id: teacherId,
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          room_or_link: data.room_or_link || null,
        },
        {
          onSuccess: async () => {
            // Refetch schedules to get updated data
            await refetchSchedules()
            reset()
            setShowAddForm(false)
            setValue('course_id', courseId)
            if (assignedTeacher) {
              setValue('teacher_id', assignedTeacher.id)
            }
          },
        }
      )
    }
  }

  const handleEdit = (scheduleId: number) => {
    setEditingId(scheduleId)
    setShowAddForm(false) // Hide add form if editing
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    reset()
    setValue('course_id', courseId)
    if (assignedTeacher) {
      setValue('teacher_id', assignedTeacher.id)
    }
  }

  const handleAddClick = () => {
    setShowAddForm(true)
    setEditingId(null)
    reset()
    setValue('course_id', courseId)
    if (assignedTeacher) {
      setValue('teacher_id', assignedTeacher.id)
    }
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
    reset()
    setValue('course_id', courseId)
    if (assignedTeacher) {
      setValue('teacher_id', assignedTeacher.id)
    }
  }

  const handleDelete = (scheduleId: number) => {
    if (window.confirm(t('schedule.modal.confirmDelete'))) {
      deleteSchedule.mutate(scheduleId, {
        onSuccess: () => {
          refetchSchedules()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('schedule.modal.title', { courseTitle })}</DialogTitle>
          <DialogDescription>{t('schedule.modal.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert if no teacher assigned */}
          {!assignedTeacher && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {t('schedule.modal.noTeacherAssigned')}
                </p>
              </div>
            </div>
          )}

          {/* Existing Schedules */}
          {!editingId && !showAddForm && (
            <>
              {isLoadingSchedules ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : schedules.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {t('schedule.modal.existingSchedules')} ({schedules.length})
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default">{schedule.day_of_week}</Badge>
                            <span className="font-medium">
                              {formatTimeTo12Hour(schedule.start_time)} - {formatTimeTo12Hour(schedule.end_time)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t('schedule.modal.teacher')}: {schedule.teacher.name}
                          </p>
                          {schedule.room_or_link && (
                            <p className="text-sm text-muted-foreground">
                              {t('schedule.modal.roomOrLink')}: {schedule.room_or_link}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(schedule.id)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(schedule.id)}
                            disabled={isSubmitting || deleteSchedule.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('schedule.modal.noSchedules')}
                  </p>
                </div>
              )}

              {/* Add Schedule Button */}
              {assignedTeacher && (
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleAddClick}
                    variant="default"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('schedule.modal.addSchedule')}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Add/Edit Form */}
          {assignedTeacher && (showAddForm || editingId) && (
            <>
              {(isFetchingSchedules || createSchedule.isPending || updateSchedule.isPending) && (
                <div className="flex items-center justify-center py-4 border rounded-lg bg-muted/50 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <p className="text-sm text-muted-foreground">
                    {createSchedule.isPending || updateSchedule.isPending
                      ? editingId
                        ? t('schedule.modal.updatingSchedule')
                        : t('schedule.modal.creatingSchedule')
                      : t('schedule.modal.loadingSchedules')}
                  </p>
                </div>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`space-y-4 ${isFetchingSchedules || createSchedule.isPending || updateSchedule.isPending ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Display assigned teacher info */}
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {t('schedule.modal.assignedTeacher')}
                  </Label>
                  <p className="text-base font-semibold mt-1">{assignedTeacher.name}</p>
                  {assignedTeacher.email && (
                    <p className="text-sm text-muted-foreground">{assignedTeacher.email}</p>
                  )}
                </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">
                    {t('schedule.modal.dayOfWeek')} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedDayOfWeek || ''}
                    onValueChange={(value) => {
                      setValue('day_of_week', value as any, { shouldValidate: true })
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="day_of_week">
                      <SelectValue placeholder={t('schedule.modal.chooseDay')} />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.day_of_week && (
                    <p className="text-sm text-destructive">{errors.day_of_week.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    {t('schedule.modal.startTime')} / {t('schedule.modal.endTime')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        id="start_time"
                        type="time"
                        {...register('start_time')}
                        disabled={isSubmitting}
                      />
                      {errors.start_time && (
                        <p className="text-sm text-destructive mt-1">{errors.start_time.message}</p>
                      )}
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="flex-1">
                      <Input
                        id="end_time"
                        type="time"
                        {...register('end_time')}
                        disabled={isSubmitting}
                      />
                      {errors.end_time && (
                        <p className="text-sm text-destructive mt-1">{errors.end_time.message}</p>
                      )}
                    </div>
                  </div>
                </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="room_or_link">{t('schedule.modal.roomOrLink')}</Label>
                <Input
                  id="room_or_link"
                  {...register('room_or_link')}
                  placeholder={t('schedule.modal.enterRoomOrLink')}
                  disabled={isSubmitting}
                />
                {errors.room_or_link && (
                  <p className="text-sm text-destructive">{errors.room_or_link.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={editingId ? handleCancelEdit : handleCancelAdd}
                disabled={isSubmitting}
              >
                {t('schedule.modal.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting || createSchedule.isPending || updateSchedule.isPending}>
                {(isSubmitting || createSchedule.isPending || updateSchedule.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingId ? t('schedule.modal.updating') : t('schedule.modal.creating')}
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    {editingId ? t('schedule.modal.update') : t('schedule.modal.create')}
                  </>
                )}
              </Button>
            </div>
          </form>
            </>
          )}

          {/* No Teacher Assigned Message */}
          {!assignedTeacher && !showAddForm && !editingId && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {t('schedule.modal.assignTeacherFirst')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

