import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, BookOpen, User, CalendarSearch, Users, Hash, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useClassSessionsByDate } from '../hooks/useClassSessions'
import { EditClassSessionModal } from './EditClassSessionModal'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'
import { format, addDays, subDays } from 'date-fns'

/** Helpers */
function formatTimeTo12Hour(time24: string): string {
  if (!time24) return time24
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours12}:${minutesStr} ${period}`
}

function toDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

/** Tab definition */
interface DateTab {
  key: string
  labelKey: string // i18n key
  date: string     // YYYY-MM-DD
}

function buildDateTabs(today: Date): DateTab[] {
  return [
    { key: 'yesterday', labelKey: 'classSession.tabs.yesterday', date: toDateString(subDays(today, 1)) },
    { key: 'today', labelKey: 'classSession.tabs.today', date: toDateString(today) },
    { key: 'tomorrow', labelKey: 'classSession.tabs.tomorrow', date: toDateString(addDays(today, 1)) },
  ]
}

function getStatusBadgeVariant(status: string): 'destructive' | 'secondary' | 'default' {
  switch (status) {
    case 'completed':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

/**
 * ClassSessionsGrid - shows class sessions for yesterday / today / tomorrow (default tabs)
 * plus a date picker for arbitrary date selection.
 */
export function ClassSessionsGrid() {
  const { t } = useTranslation()

  const today = useMemo(() => new Date(), [])
  const tabs = useMemo(() => buildDateTabs(today), [today])

  // Active tab key: 'yesterday' | 'today' | 'tomorrow' | 'custom'
  const [activeTab, setActiveTab] = useState<string>('today')

  // The actual date being queried (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(today))

  // Date picker value (for the custom tab)
  const [customDate, setCustomDate] = useState<string>('')
  // Edit modal: which session is being edited
  const [editSessionId, setEditSessionId] = useState<number | null>(null)

  const { data, isLoading, error } = useClassSessionsByDate(selectedDate)
  const sessions = data?.data || []

  /** Handle tab click — also clear the date picker */
  const handleTabClick = (tab: DateTab) => {
    setActiveTab(tab.key)
    setSelectedDate(tab.date)
    setCustomDate('') // clear custom date so the picker resets
  }

  /** Handle custom date change */
  const handleCustomDateChange = (value: string) => {
    setCustomDate(value)
    if (value) {
      setActiveTab('custom')
      setSelectedDate(value)
    }
  }

  /** Format the displayed date heading */
  const displayDate = useMemo(() => {
    try {
      return format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM dd, yyyy')
    } catch {
      return selectedDate
    }
  }, [selectedDate])

  /** Error state */
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('common.messages.somethingWentWrong')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  /** Skeleton loading */
  const skeletonGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Tab bar - sticky, matching enrollment course grid style */}
      <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 lg:-mx-6 xl:-mx-8 px-4 lg:px-6 xl:px-8 pt-4">
        <div className="w-full">
          <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
            <div className="inline-flex w-auto gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap items-center">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <Button
                    key={tab.key}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTabClick(tab)}
                    className={cn(
                      'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all',
                      isActive && 'bg-primary-active text-primary shadow-sm font-semibold'
                    )}
                  >
                    {t(tab.labelKey)}
                  </Button>
                )
              })}

              {/* Separator */}
              <div className="h-6 w-px bg-border mx-1 hidden sm:block flex-shrink-0" />

              {/* Date picker for custom date */}
              <div className="relative flex items-center gap-2 flex-shrink-0">
                <CalendarSearch className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  className={cn(
                    'h-8 w-[160px] text-xs sm:text-sm',
                    activeTab === 'custom' && 'border-primary ring-1 ring-primary'
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date heading */}
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{displayDate}</h3>
        <Badge variant="outline" className="ml-2">
          {isLoading ? '...' : sessions.length} {t('classSession.grid.sessions')}
        </Badge>
      </div>

      {/* Loading */}
      {isLoading && skeletonGrid}

      {/* Empty state */}
      {!isLoading && sessions.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('classSession.grid.noSessions')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions grid */}
      {!isLoading && sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="h-full transition-all hover:shadow-md hover:border-primary/50"
            >
              <CardContent className="pt-6 space-y-3">
                {/* Course title (links to course detail) + Edit button */}
                {session.course && (
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/courses/${session.course.slug}`}
                      className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors"
                    >
                      {session.course.title}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault()
                        setEditSessionId(session.id)
                      }}
                      title={t('classSession.edit.title')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Subject */}
                {session.course?.subject && (
                  <p className="text-xs text-muted-foreground">{session.course.subject.name}</p>
                )}

                {/* Badges: status + course type */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={getStatusBadgeVariant(session.status)} className="text-xs">
                    {t(`common.status.${session.status}`)}
                  </Badge>
                  {session.course?.course_type && (
                    <Badge variant="outline" className="text-xs">
                      {t(`classSession.grid.courseType.${session.course.course_type}`)}
                    </Badge>
                  )}
                </div>

                {/* Time */}
                {session.schedule && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>
                      {formatTimeTo12Hour(session.schedule.start_time)} – {formatTimeTo12Hour(session.schedule.end_time)}
                    </span>
                  </div>
                )}

                {/* Teacher */}
                {session.teacher && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-5 w-5" />
                    <span className="truncate">{session.teacher.name}</span>
                  </div>
                )}

                {/* Topic */}
                {session.topic_covered && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                    <span className="truncate" title={session.topic_covered}>
                      {session.topic_covered}
                    </span>
                  </div>
                )}

                {/* Room / Link */}
                {session.schedule?.room_or_link && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span className="truncate" title={session.schedule.room_or_link}>
                      {session.schedule.room_or_link}
                    </span>
                  </div>
                )}

                {/* Session number + Student count */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {session.session_number != null && session.total_sessions != null && (
                    <div className="flex items-center gap-1">
                      <Hash className="h-5 w-5" />
                      <span>{t('classSession.grid.sessionNumber', { current: session.session_number, total: session.total_sessions })}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{session.enrollment_count} {t('classSession.grid.students')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditClassSessionModal
        open={editSessionId != null}
        onOpenChange={(open) => { if (!open) setEditSessionId(null) }}
        sessionId={editSessionId}
      />
    </div>
  )
}
