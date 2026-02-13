import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { useClassSession, useUpdateClassSession } from '../hooks/useClassSessions'
import { useTeachers } from '@/features/teachers/hooks/useTeachers'
import type { UpdateClassSessionInput } from '../types/class-session.types'
import { useTranslation } from '@/i18n/context'
import { Skeleton } from '@/components/ui/skeleton'

interface EditClassSessionFormData {
  status: 'scheduled' | 'completed' | 'cancelled'
  teacher_id: number | null
  room_or_link: string
  topic_covered: string
}

interface EditClassSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: number | null
  /** When provided (e.g. when opened from course detail), invalidates course after update */
  courseSlug?: string
}

/**
 * EditClassSessionModal - modal form to edit a class session (status, teacher, room/link, topic).
 */
export function EditClassSessionModal({
  open,
  onOpenChange,
  sessionId,
  courseSlug,
}: EditClassSessionModalProps) {
  const { t } = useTranslation()
  const updateSession = useUpdateClassSession(courseSlug)
  const lastPopulatedRef = useRef<{ sessionId: number; timestamp: number } | null>(null)

  const {
    data: sessionData,
    isLoading: isLoadingSession,
    isFetching: isFetchingSession,
    dataUpdatedAt: sessionDataUpdatedAt,
  } = useClassSession(sessionId)

  const { data: teachersData } = useTeachers({ per_page: 100 })
  const teacherOptions = useMemo(() => {
    return teachersData?.data.map((teacher) => ({
      value: String(teacher.id),
      label: teacher.user?.name ?? teacher.teacher_id ?? '',
    })) ?? []
  }, [teachersData?.data])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditClassSessionFormData>({
    defaultValues: {
      status: 'scheduled',
      teacher_id: null,
      room_or_link: '',
      topic_covered: '',
    },
  })

  useEffect(() => {
    if (!open || !sessionId || !sessionData?.data) return
    if (isLoadingSession || isFetchingSession) return

    const session = sessionData.data
    const shouldPopulate =
      lastPopulatedRef.current === null ||
      lastPopulatedRef.current.sessionId !== sessionId ||
      sessionDataUpdatedAt > lastPopulatedRef.current.timestamp

    if (!shouldPopulate) return

    reset({
      status: session.status ?? 'scheduled',
      teacher_id: session.teacher_id ?? null,
      room_or_link: session.room_or_link ?? '',
      topic_covered: session.topic_covered ?? '',
    }, { keepDefaultValues: false })

    lastPopulatedRef.current = { sessionId, timestamp: sessionDataUpdatedAt }
  }, [open, sessionId, sessionData, isLoadingSession, isFetchingSession, sessionDataUpdatedAt, reset])

  const onSubmit = (data: EditClassSessionFormData) => {
    if (!sessionId) return
    const payload: UpdateClassSessionInput = {
      status: data.status,
      teacher_id: data.teacher_id ?? null,
      room_or_link: data.room_or_link.trim() || null,
      topic_covered: data.topic_covered.trim() || null,
    }
    updateSession.mutate(
      { id: sessionId, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const isLoading = isSubmitting || updateSession.isPending
  const showForm = open && sessionId && !isLoadingSession && sessionData?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('classSession.edit.title')}</DialogTitle>
          <DialogDescription>{t('classSession.edit.description')}</DialogDescription>
        </DialogHeader>

        {isLoadingSession && sessionId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher_id">{t('classSession.edit.teacher')}</Label>
              <Combobox
                options={teacherOptions}
                value={watch('teacher_id') != null ? String(watch('teacher_id')) : undefined}
                onValueChange={(value) => setValue('teacher_id', value ? Number(value) : null, { shouldValidate: true })}
                placeholder={t('classSession.edit.selectTeacher')}
                searchPlaceholder={t('classSession.edit.searchTeacher')}
                emptyText={t('classSession.edit.noTeachersFound')}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">{t('classSession.edit.teacherHint')}</p>
              {errors.teacher_id && (
                <p className="text-sm text-destructive">{errors.teacher_id.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">{t('classSession.edit.status')}</Label>
              <Select
                value={watch('status') || 'scheduled'}
                onValueChange={(value) => setValue('status', value as EditClassSessionFormData['status'], { shouldValidate: true })}
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
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_or_link">{t('classSession.edit.roomOrLink')}</Label>
              <Input
                id="room_or_link"
                {...register('room_or_link')}
                placeholder={t('classSession.edit.roomOrLinkPlaceholder')}
                disabled={isLoading}
              />
              {errors.room_or_link && (
                <p className="text-sm text-destructive">{errors.room_or_link.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic_covered">{t('classSession.edit.topicCovered')}</Label>
              <Textarea
                id="topic_covered"
                {...register('topic_covered')}
                placeholder={t('classSession.edit.topicCoveredPlaceholder')}
                rows={3}
                disabled={isLoading}
                className="resize-none"
              />
              {errors.topic_covered && (
                <p className="text-sm text-destructive">{errors.topic_covered.message}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('classSession.edit.cancel')}
              </Button>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('classSession.edit.saving')}
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('classSession.edit.update')}
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
