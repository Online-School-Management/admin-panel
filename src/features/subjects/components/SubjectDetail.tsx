import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useSubject } from '../hooks/useSubjects'
import format from 'date-fns/format'
import type { Subject } from '../types/subject.types'
import { useTranslation } from '@/i18n/context'

interface SubjectDetailProps {
  subjectSlug: string
}

/**
 * SubjectDetail component - displays detailed subject information
 */
export function SubjectDetail({ subjectSlug }: SubjectDetailProps) {
  const { t } = useTranslation()
  const { data: subjectData, isLoading, error } = useSubject(subjectSlug)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('subject.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!subjectData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('subject.messages.subjectNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const subject: Subject = subjectData.data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('subject.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.name')}</p>
                  <p className="text-base font-semibold">{subject.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.slug')}</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{subject.slug}</code>
                </div>
                {subject.description && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('subject.detail.description')}
                    </p>
                    <p className="text-base whitespace-pre-wrap">{subject.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('subject.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subject.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.created')}</p>
                  <p className="text-base text-sm">
                    {format(new Date(subject.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {subject.updated_at && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.updated')}</p>
                      <p className="text-base text-sm">
                        {format(new Date(subject.updated_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
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

