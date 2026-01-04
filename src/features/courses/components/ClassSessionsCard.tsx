import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ClassSession } from '../types/course.types'
import { useTranslation } from '@/i18n/context'

interface ClassSessionsCardProps {
  classSessions: ClassSession[]
  maxDisplay?: number
}

function formatTimeTo12Hour(time24: string): string {
  if (!time24) return time24
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours12}:${minutesStr} ${period}`
}

function getStatusIcon(status: string): string | null {
  switch (status) {
    case 'scheduled':
      return '📝'
    case 'completed':
      return '✅'
    case 'cancelled':
      return '❌'
    default:
      return '📝'
  }
}

function getStatusVariant(status: string): 'destructive' | 'secondary' {
  switch (status) {
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function ClassSessionsCard({ 
  classSessions, 
  maxDisplay = 28 
}: ClassSessionsCardProps) {
  const { t } = useTranslation()

  if (!classSessions || classSessions.length === 0) {
    return null
  }

  const displayedSessions = classSessions.slice(0, maxDisplay)
  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {t('course.detail.classSessions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {displayedSessions.map((session) => {
            const sessionDate = new Date(session.session_date)
            const isToday = sessionDate.toDateString() === today.toDateString()
            const isPast = sessionDate < today && !isToday

            const statusIcon = getStatusIcon(session.status)

            return (
              <div
                key={session.id}
                className={`p-3 border rounded-lg space-y-2 ${
                  isToday ? 'border-primary bg-primary/5' : ''
                } ${isPast ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    {format(sessionDate, 'MMM dd')}
                  </p>
                  {statusIcon ? (
                    <span className="text-base" title={t(`common.status.${session.status}`)}>
                      {statusIcon}
                    </span>
                  ) : (
                    <Badge variant={getStatusVariant(session.status)} className="text-xs">
                      {t(`common.status.${session.status}`)}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {format(sessionDate, 'EEE')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeTo12Hour(session.schedule.start_time)} -{' '}
                    {formatTimeTo12Hour(session.schedule.end_time)}
                  </p>
                  {session.schedule.room_or_link && (
                    <p 
                      className="text-xs text-muted-foreground truncate" 
                      title={session.schedule.room_or_link}
                    >
                      📍 {session.schedule.room_or_link}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {classSessions.length > maxDisplay && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            {t('course.detail.moreSessions', { count: classSessions.length - maxDisplay })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

