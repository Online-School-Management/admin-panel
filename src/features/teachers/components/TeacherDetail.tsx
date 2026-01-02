import { Mail, Phone, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useTeacher } from '../hooks/useTeachers'
import format from 'date-fns/format'
import type { Teacher } from '../types/teacher.types'
import { useTranslation } from '@/i18n/context'

interface TeacherDetailProps {
  teacherSlug: string
}

/**
 * TeacherDetail component - displays detailed teacher information
 */
export function TeacherDetail({ teacherSlug }: TeacherDetailProps) {
  const { t } = useTranslation()
  const { data: teacherData, isLoading, error } = useTeacher(teacherSlug)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('teacher.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!teacherData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('teacher.messages.teacherNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const teacher: Teacher = teacherData.data

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'suspended':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getEmploymentTypeLabel = (type: string) => {
    return t(`teacher.employmentType.${type}`) || type
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.teacherId')}</p>
                  <p className="text-base font-semibold">{teacher.teacher_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.fullName')}</p>
                  <p className="text-base font-semibold">{teacher.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('common.labels.email')}
                  </p>
                  <p className="text-base">{teacher.user.email}</p>
                </div>
                {teacher.user.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('common.labels.phone')}
                    </p>
                    <p className="text-base">{teacher.user.phone}</p>
                  </div>
                )}
                {teacher.department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.department')}</p>
                    <p className="text-base">{teacher.department}</p>
                  </div>
                )}
                {teacher.subject && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.subject')}</p>
                    <p className="text-base">{teacher.subject}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.employmentType')}</p>
                  <Badge variant="outline">
                    {getEmploymentTypeLabel(teacher.employment_type)}
                  </Badge>
                </div>
                {teacher.commission_rate && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.commissionRate')}</p>
                    <p className="text-base">{teacher.commission_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.detail.additionalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacher.hire_date && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('teacher.detail.hireDate')}
                    </p>
                    <p className="text-base">
                      {format(new Date(teacher.hire_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                {teacher.user.date_of_birth && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('common.labels.dateOfBirth')}</p>
                    <p className="text-base">
                      {format(new Date(teacher.user.date_of_birth), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                {teacher.user.gender && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('common.labels.gender')}</p>
                    <p className="text-base capitalize">{teacher.user.gender}</p>
                  </div>
                )}
                {teacher.user.address && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('common.labels.address')}
                    </p>
                    <p className="text-base">{teacher.user.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {teacher.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t('teacher.detail.notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">{teacher.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.userStatus')}</p>
                <Badge variant={getStatusBadgeVariant(teacher.user.status)}>
                  {getStatusLabel(teacher.user.status)}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.teacherStatus')}</p>
                <Badge variant={getStatusBadgeVariant(teacher.status)}>
                  {getStatusLabel(teacher.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teacher.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.created')}</p>
                  <p className="text-base text-sm">
                    {format(new Date(teacher.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {teacher.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('teacher.detail.updated')}</p>
                    <p className="text-base text-sm">
                      {format(new Date(teacher.updated_at), 'MMM dd, yyyy HH:mm')}
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

