import { Link } from 'react-router-dom'
import { Mail, Phone, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useEnrollment } from '../hooks/useEnrollments'
import format from 'date-fns/format'
import { useTranslation } from '@/i18n/context'

interface EnrollmentDetailProps {
  enrollmentId: number
}

/**
 * EnrollmentDetail component - displays detailed enrollment information
 */
export function EnrollmentDetail({ enrollmentId }: EnrollmentDetailProps) {
  const { t } = useTranslation()
  const { data: enrollmentData, isLoading, error } = useEnrollment(enrollmentId)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('enrollment.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!enrollmentData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('enrollment.messages.enrollmentNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const enrollment = enrollmentData.data

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'dropped':
        return 'destructive'
      case 'completed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('enrollment.detail.enrollmentInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('enrollment.detail.status')}
                  </p>
                  <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                    {getStatusLabel(enrollment.status)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('enrollment.detail.enrolledAt')}
                  </p>
                  <p className="text-base">
                    {enrollment.enrolled_at
                      ? format(new Date(enrollment.enrolled_at), 'MMM dd, yyyy')
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('enrollment.detail.studentInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment.student ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('enrollment.detail.studentId')}
                      </p>
                      <p className="text-base font-semibold">{enrollment.student.student_id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('enrollment.detail.studentName')}
                      </p>
                      <p className="text-base font-semibold">{enrollment.student.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t('common.labels.email')}
                      </p>
                      <p className="text-base">{enrollment.student.email || '-'}</p>
                    </div>
                    {enrollment.student.phone && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t('common.labels.phone')}
                        </p>
                        <p className="text-base">{enrollment.student.phone}</p>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <Link
                      to={`/students/${enrollment.student.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('enrollment.detail.viewStudent')} →
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic">Student has been deleted</p>
              )}
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('enrollment.detail.courseInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('enrollment.detail.courseTitle')}
                  </p>
                  <p className="text-base font-semibold">{enrollment.course.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('enrollment.detail.subject')}
                  </p>
                  <p className="text-base">{enrollment.course.subject.name}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Link
                  to={`/courses/${enrollment.course.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('enrollment.detail.viewCourse')} →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('enrollment.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                {getStatusLabel(enrollment.status)}
              </Badge>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.labels.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('common.labels.createdAt')}
                  </p>
                  <p className="text-base text-sm">
                    {format(new Date(enrollment.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {enrollment.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('common.labels.updatedAt')}
                    </p>
                    <p className="text-base text-sm">
                      {format(new Date(enrollment.updated_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

