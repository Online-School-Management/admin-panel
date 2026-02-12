import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, CalendarPlus } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateClassSession } from '../hooks/useClassSessions'
import type { CreateClassSessionInput } from '../types/class-session.types'
import type { CourseSchedule } from '@/features/courses/types/course.types'
import { useTranslation } from '@/i18n/context'

function formatTimeTo12Hour(time24: string): string {
  if (!time24) return time24
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours12}:${minutesStr} ${period}`
}

interface CreateClassSessionFormData {
  schedule_id: number
  session_date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  topic_covered: string
}

interface CreateClassSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseSlug: string
  schedules: CourseSchedule[]
}

/**
 * CreateClassSessionModal - modal to create a class session manually on the course detail page.
 */
export function CreateClassSessionModal({
  open,
  onOpenChange,
  courseSlug,
  schedules,
}: CreateClassSessionModalProps) {
  const { t } = useTranslation()
  const createSession = useCreateClassSession(courseSlug)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassSessionFormData>({
    defaultValues: {
      schedule_id: schedules[0]?.id ?? 0,
      session_date: '',
      status: 'scheduled',
      topic_covered: '',
    },
  })

  const scheduleId = watch('schedule_id')
  const sessionDate = watch('session_date')
  const canSubmit = scheduleId > 0 && !!sessionDate.trim()

  useEffect(() => {
    if (open) {
      reset({
        schedule_id: schedules[0]?.id ?? 0,
        session_date: '',
        status: 'scheduled',
        topic_covered: '',
      })
    }
  }, [open, schedules, reset])

  const onSubmit = (data: CreateClassSessionFormData) => {
    const payload: CreateClassSessionInput = {
      schedule_id: data.schedule_id,
      session_date: data.session_date,
      status: data.status,
      topic_covered: data.topic_covered?.trim() || undefined,
    }
    createSession.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const isLoading = isSubmitting || createSession.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('classSession.create.title')}</DialogTitle>
          <DialogDescription>{t('classSession.create.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule_id">{t('classSession.create.schedule')}</Label>
            <Select
              value={watch('schedule_id') ? String(watch('schedule_id')) : ''}
              onValueChange={(value) => setValue('schedule_id', Number(value), { shouldValidate: true })}
              disabled={isLoading}
            >
              <SelectTrigger id="schedule_id">
                <SelectValue placeholder={t('classSession.create.selectSchedule')} />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((schedule) => {
                  const start = formatTimeTo12Hour(schedule.start_time)
                  const end = formatTimeTo12Hour(schedule.end_time)
                  return (
                    <SelectItem key={schedule.id} value={String(schedule.id)}>
                      {schedule.day_of_week} {start} – {end}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {errors.schedule_id && (
              <p className="text-sm text-destructive">{errors.schedule_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session_date">{t('classSession.create.sessionDate')}</Label>
            <Input
              id="session_date"
              type="date"
              {...register('session_date', { required: true })}
              disabled={isLoading}
            />
            {errors.session_date && (
              <p className="text-sm text-destructive">{errors.session_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t('classSession.create.status')}</Label>
            <Select
              value={watch('status') || 'scheduled'}
              onValueChange={(value) =>
                setValue('status', value as CreateClassSessionFormData['status'], { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">{t('common.status.scheduled')}</SelectItem>
                <SelectItem value="completed">{t('common.status.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('common.status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic_covered">{t('classSession.create.topicCovered')}</Label>
            <Textarea
              id="topic_covered"
              {...register('topic_covered')}
              placeholder={t('classSession.create.topicCoveredPlaceholder')}
              rows={2}
              disabled={isLoading}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('classSession.create.cancel')}
            </Button>
            <Button type="submit" variant="default" disabled={isLoading || !canSubmit}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('classSession.create.creating')}
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  {t('classSession.create.create')}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
