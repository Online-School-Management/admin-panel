import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichHtmlContent } from '@/components/common/RichHtmlContent'
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
      <Card className="w-full min-w-0 overflow-hidden">
        <CardContent className="pt-6">
          <p className="text-destructive break-words">
            {t('subject.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!subjectData?.data) {
    return (
      <Card className="w-full min-w-0 overflow-hidden">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('subject.messages.subjectNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const subject: Subject = subjectData.data

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:items-start">
        {/* Main: second on mobile (after sidebar) when using order — see below */}
        <div className="min-w-0 space-y-6 lg:col-span-2 lg:order-1 order-2">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="space-y-1 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl break-words">
                {t('subject.detail.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.name')}</p>
                  <p className="text-base font-semibold break-words">{subject.name}</p>
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.slug')}</p>
                  <code className="block w-full max-w-full break-all rounded bg-muted px-2 py-1 text-left text-xs sm:text-sm">
                    {subject.slug}
                  </code>
                </div>
                {subject.short_description && (
                  <div className="min-w-0 space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('subject.detail.shortDescription')}
                    </p>
                    <p className="text-base text-muted-foreground break-words">
                      {subject.short_description}
                    </p>
                  </div>
                )}
                {(subject.tag_en || subject.tag_mm) && (
                  <div className="min-w-0 space-y-2 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('subject.detail.tags')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subject.tag_en && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          EN: {subject.tag_en}
                        </span>
                      )}
                      {subject.tag_mm && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          MM: {subject.tag_mm}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {subject.description && (
                  <div className="min-w-0 space-y-2 md:col-span-2">
                    <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4 shrink-0" aria-hidden />
                      {t('subject.detail.description')}
                    </p>
                    <RichHtmlContent html={subject.description} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: image + timestamps — first on narrow screens so hero image shows before long text */}
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-1 lg:order-2 order-1">
          {subject.image_url && (
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="space-y-1 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">{t('subject.detail.image')}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6">
                <div className="relative w-full overflow-hidden rounded-lg border bg-muted/30">
                  <img
                    src={subject.image_url}
                    alt=""
                    className="mx-auto max-h-[min(50vh,22rem)] w-full max-w-full object-contain sm:max-h-[min(55vh,26rem)]"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="space-y-1 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">{t('subject.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              {subject.created_at && (
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.created')}</p>
                  <p className="text-sm break-words sm:text-base">
                    {format(new Date(subject.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {subject.updated_at && (
                <div className="min-w-0 border-t pt-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('subject.detail.updated')}</p>
                    <p className="text-sm break-words sm:text-base">
                      {format(new Date(subject.updated_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
