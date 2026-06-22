import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Loader2, Trash2, Edit, Plus, Info } from 'lucide-react'
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
  useCourseTeachersForSchedule,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from '../hooks/useSchedules'
import { createScheduleSchema, type CreateScheduleFormData } from '../schemas/schedule.schemas'
import { useTranslation } from '@/i18n/context'
import { formatCurrency } from '@/utils/format'
import type { CourseTeacherForSchedule } from '../types/schedule.types'

const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
] as const

function formatTimeTo12Hour(time24: string): string {
  if (!time24) return time24

  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')

  return `${hours12}:${minutesStr} ${period}`
}

function formatCommission(
  teacher: CourseTeacherForSchedule | null | undefined,
  t: (key: string) => string,
): string | null {
  if (!teacher?.commission_type) return null

  switch (teacher.commission_type) {
    case 'monthly_percent':
      return teacher.commission_rate != null
        ? `${t('teacher.commissionType.monthly_percent')}: ${Number(teacher.commission_rate).toFixed(2)}%`
        : t('teacher.commissionType.monthly_percent')
    case 'monthly_salary':
      return teacher.monthly_salary_amount != null
        ? `${t('teacher.commissionType.monthly_salary')}: ${formatCurrency(Number(teacher.monthly_salary_amount))}`
        : t('teacher.commissionType.monthly_salary')
    case 'per_session':
      return teacher.per_session_amount != null
        ? `${t('teacher.commissionType.per_session')}: ${formatCurrency(Number(teacher.per_session_amount))}`
        : t('teacher.commissionType.per_session')
    case 'fixed_amount':
      return teacher.fixed_amount != null
        ? `${t('teacher.commissionType.fixed_amount')}: ${formatCurrency(Number(teacher.fixed_amount))}`
        : t('teacher.commissionType.fixed_amount')
    default:
      return null
  }
}

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle: string
}

export function ScheduleModal({
  open,
  onOpenChange,
  courseId,
  courseTitle,
}: ScheduleModalProps) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [originalTeacherId, setOriginalTeacherId] = useState<number | null>(null)

  const {
    data: schedulesData,
    isLoading: isLoadingSchedules,
    isFetching: isFetchingSchedules,
    refetch: refetchSchedules,
  } = useSchedulesByCourse(courseId)

  const {
    data: courseTeachersData,
    isLoading: isLoadingTeachers,
  } = useCourseTeachersForSchedule(courseId, open)

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
      teacher_id: null,
      day_of_week: undefined as any,
      start_time: '',
      end_time: '',
      room_or_link: null,
    },
  })

  const selectedDayOfWeek = watch('day_of_week')
  const selectedTeacherId = watch('teacher_id')
  const schedules = schedulesData?.data || []
  const courseTeachers = courseTeachersData?.data || []

  const defaultTeacherId = useMemo(() => {
    if (courseTeachers.length === 1) {
      return courseTeachers[0].id
    }
    return null
  }, [courseTeachers])

  const assignedCourseTeacher = useMemo(() => {
    if (originalTeacherId == null) return null
    return courseTeachers.find((ct) => ct.id === originalTeacherId) ?? null
  }, [originalTeacherId, courseTeachers])

  const showAssignedTeacher = editingId != null && originalTeacherId != null
  const showTeacherDropdown = !showAssignedTeacher && courseTeachers.length > 0

  useEffect(() => {
    if (!open) {
      reset()
      setEditingId(null)
      setShowAddForm(false)
      setOriginalTeacherId(null)
    } else {
      refetchSchedules()
      if (editingId) {
        const scheduleToEdit = schedules.find((s) => s.id === editingId)
        if (scheduleToEdit) {
          const teacherId = scheduleToEdit.teacher_id ?? scheduleToEdit.teacher?.id ?? null
          setOriginalTeacherId(teacherId)
          setValue('teacher_id', teacherId)
          setValue('day_of_week', scheduleToEdit.day_of_week)
          setValue('start_time', scheduleToEdit.start_time)
          setValue('end_time', scheduleToEdit.end_time)
          setValue('room_or_link', scheduleToEdit.room_or_link || null)
        }
      }
    }
  }, [open, editingId, schedules, reset, setValue, refetchSchedules])

  const resetAddForm = () => {
    reset({
      course_id: courseId,
      teacher_id: defaultTeacherId,
      day_of_week: undefined as any,
      start_time: '',
      end_time: '',
      room_or_link: null,
    })
  }

  const submitSchedule = (data: CreateScheduleFormData) => {
    const teacherId = data.teacher_id ?? null

    if (editingId) {
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
            await refetchSchedules()
            resetAddForm()
            setEditingId(null)
            setShowAddForm(false)
            setOriginalTeacherId(null)
          },
        }
      )
    } else {
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
            await refetchSchedules()
            resetAddForm()
            setShowAddForm(false)
          },
        }
      )
    }
  }

  const handleEdit = (scheduleId: number) => {
    const scheduleToEdit = schedules.find((s) => s.id === scheduleId)
    if (!scheduleToEdit) return

    const teacherId = scheduleToEdit.teacher_id ?? scheduleToEdit.teacher?.id ?? null
    setOriginalTeacherId(teacherId)
    setEditingId(scheduleId)
    setShowAddForm(false)
    setValue('course_id', courseId)
    setValue('teacher_id', teacherId)
    setValue('day_of_week', scheduleToEdit.day_of_week)
    setValue('start_time', scheduleToEdit.start_time)
    setValue('end_time', scheduleToEdit.end_time)
    setValue('room_or_link', scheduleToEdit.room_or_link || null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setOriginalTeacherId(null)
    resetAddForm()
  }

  const handleAddClick = () => {
    setShowAddForm(true)
    setEditingId(null)
    setOriginalTeacherId(null)
    resetAddForm()
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
    resetAddForm()
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

  const showForm = showAddForm || editingId
  const assignedCommission = formatCommission(assignedCourseTeacher, t)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('schedule.modal.title', { courseTitle })}</DialogTitle>
          <DialogDescription>{t('schedule.modal.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {courseTeachers.length === 0 && (
            <div className="p-4 bg-muted border rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t('schedule.modal.noTeachersOnCourseHint')}
              </p>
            </div>
          )}

          {!editingId && !showAddForm && (
            <>
              {isLoadingSchedules ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : schedules.length > 0 ? (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    {t('schedule.modal.existingSchedules')} ({schedules.length})
                  </Label>
                  <div className="space-y-2">
                    {schedules.map((schedule) => {
                      const teacherId = schedule.teacher_id ?? schedule.teacher?.id ?? null
                      const courseTeacher = teacherId
                        ? courseTeachers.find((ct) => ct.id === teacherId)
                        : null
                      const commission = formatCommission(courseTeacher, t)

                      return (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="default">{schedule.day_of_week}</Badge>
                              <span className="font-medium">
                                {formatTimeTo12Hour(schedule.start_time)} -{' '}
                                {formatTimeTo12Hour(schedule.end_time)}
                              </span>
                            </div>
                            {teacherId != null && (
                              <p className="text-sm text-muted-foreground">
                                {t('schedule.modal.teacher')}:{' '}
                                {schedule.teacher?.name ?? courseTeacher?.name}
                                {commission && (
                                  <>
                                    {' · '}
                                    {t('schedule.modal.commission')}: {commission}
                                  </>
                                )}
                              </p>
                            )}
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
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('schedule.modal.noSchedules')}
                  </p>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <Button onClick={handleAddClick} variant="default" disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('schedule.modal.addSchedule')}
                </Button>
              </div>
            </>
          )}

          {showForm && (
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
                onSubmit={handleSubmit(submitSchedule)}
                className={`space-y-4 ${isFetchingSchedules || createSchedule.isPending || updateSchedule.isPending ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {showAssignedTeacher && (
                  <div className="space-y-2">
                    <Label>{t('schedule.modal.assignedTeacher')}</Label>
                    <div className="p-3 bg-muted border rounded-lg">
                      <p className="font-medium">
                        {assignedCourseTeacher?.name ?? schedules.find((s) => s.id === editingId)?.teacher?.name}
                      </p>
                      {assignedCommission && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('schedule.modal.commission')}: {assignedCommission}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {showTeacherDropdown && (
                  <div className="space-y-2">
                    <Label htmlFor="teacher_id">{t('schedule.modal.selectTeacher')}</Label>
                    <Select
                      value={selectedTeacherId != null ? String(selectedTeacherId) : ''}
                      onValueChange={(value) => {
                        setValue('teacher_id', Number(value), { shouldValidate: true })
                      }}
                      disabled={isSubmitting || isLoadingTeachers}
                    >
                      <SelectTrigger id="teacher_id">
                        <SelectValue placeholder={t('schedule.modal.chooseTeacher')} />
                      </SelectTrigger>
                      <SelectContent>
                        {courseTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={String(teacher.id)}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teacher_id && (
                      <p className="text-sm text-destructive">{errors.teacher_id.message}</p>
                    )}
                  </div>
                )}

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
                    {t('schedule.modal.startTime')} / {t('schedule.modal.endTime')}{' '}
                    <span className="text-destructive">*</span>
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

                <div className="space-y-2">
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

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={editingId ? handleCancelEdit : handleCancelAdd}
                    disabled={isSubmitting}
                  >
                    {t('schedule.modal.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || createSchedule.isPending || updateSchedule.isPending}
                  >
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
