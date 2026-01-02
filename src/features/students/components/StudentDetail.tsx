import { Mail, Phone, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useStudent } from '../hooks/useStudents'
import format from 'date-fns/format'
import type { Student } from '../types/student.types'
import { useTranslation } from '@/i18n/context'

interface StudentDetailProps {
  studentSlug: string
}

/**
 * StudentDetail component - displays detailed student information
 */
export function StudentDetail({ studentSlug }: StudentDetailProps) {
  const { t } = useTranslation()
  const { data: studentData, isLoading, error } = useStudent(studentSlug)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('student.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!studentData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('student.messages.studentNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const student: Student = studentData.data

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('student.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('student.detail.studentId')}</p>
                  <p className="text-base font-semibold">{student.student_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('student.detail.fullName')}</p>
                  <p className="text-base font-semibold">{student.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('common.labels.email')}
                  </p>
                  <p className="text-base">{student.user.email}</p>
                </div>
                {student.user.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('common.labels.phone')}
                    </p>
                    <p className="text-base">{student.user.phone}</p>
                  </div>
                )}
                {student.guardian_phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('student.detail.guardianPhone')}</p>
                    <p className="text-base">{student.guardian_phone}</p>
                  </div>
                )}
                {student.age && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('student.detail.age')}</p>
                    <p className="text-base">{student.age}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('student.detail.additionalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.user.date_of_birth && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('common.labels.dateOfBirth')}
                    </p>
                    <p className="text-base">
                      {format(new Date(student.user.date_of_birth), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                {student.user.gender && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('common.labels.gender')}</p>
                    <p className="text-base capitalize">{student.user.gender}</p>
                  </div>
                )}
                {student.user.address && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('common.labels.address')}
                    </p>
                    <p className="text-base">{student.user.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('student.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('student.detail.userStatus')}</p>
                <Badge variant={getStatusBadgeVariant(student.user.status)}>
                  {getStatusLabel(student.user.status)}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('student.detail.studentStatus')}</p>
                <Badge variant={getStatusBadgeVariant(student.status)}>
                  {getStatusLabel(student.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('student.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('student.detail.created')}</p>
                  <p className="text-base text-sm">
                    {format(new Date(student.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {student.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('student.detail.updated')}</p>
                    <p className="text-base text-sm">
                      {format(new Date(student.updated_at), 'MMM dd, yyyy HH:mm')}
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

