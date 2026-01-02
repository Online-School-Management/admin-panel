import { Calendar, DollarSign, Clock, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useCourse } from '../hooks/useCourses'
import format from 'date-fns/format'
import type { Course } from '../types/course.types'
import { useTranslation } from '@/i18n/context'

interface CourseDetailProps {
  courseSlug: string
}

/**
 * CourseDetail component - displays detailed course information
 */
export function CourseDetail({ courseSlug }: CourseDetailProps) {
  const { t } = useTranslation()
  const { data: courseData, isLoading, error } = useCourse(courseSlug)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('course.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!courseData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('course.messages.courseNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const course: Course = courseData.data

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'upcoming':
        return 'secondary'
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('course.detail.subject')}
                  </p>
                  <p className="text-base font-semibold">{course.subject.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('course.detail.title')}</p>
                  <p className="text-base font-semibold">{course.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('course.detail.duration')}
                  </p>
                  <p className="text-base">{course.duration_months} {t('course.detail.months')}</p>
                </div>
                {course.monthly_fee && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t('course.detail.monthlyFee')}
                    </p>
                    <p className="text-base">
                      ${course.monthly_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {course.total_fee && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t('course.detail.totalFee')}
                    </p>
                    <p className="text-base">
                      ${course.total_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          {(course.start_date || course.end_date) && (
            <Card>
              <CardHeader>
                <CardTitle>{t('course.detail.dates')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.start_date && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('course.detail.startDate')}
                      </p>
                      <p className="text-base">
                        {format(new Date(course.start_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {course.end_date && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('course.detail.endDate')}
                      </p>
                      <p className="text-base">
                        {format(new Date(course.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('course.detail.courseStatus')}</p>
                <Badge variant={getStatusBadgeVariant(course.status)}>
                  {t(`common.status.${course.status}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('course.detail.created')}</p>
                  <p className="text-base text-sm">
                    {format(new Date(course.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {course.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('course.detail.updated')}</p>
                    <p className="text-base text-sm">
                      {format(new Date(course.updated_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

