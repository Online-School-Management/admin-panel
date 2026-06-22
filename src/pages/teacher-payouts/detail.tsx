import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Download, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/i18n/context'
import { usePayout, useMarkPayoutAsPaid } from '@/features/payouts/hooks/usePayouts'
import { MarkPayoutAsPaidDialog } from '@/features/teacher-payouts/components/MarkPayoutAsPaidDialog'
import { EditPayoutBonusModal } from '@/features/teacher-payouts/components/EditPayoutBonusModal'
import { exportPayoutSummaryToExcel } from '@/features/teacher-payouts/utils/exportPayoutSummaryExcel'
import { formatCurrency, safeText } from '@/utils/format'
import { cn } from '@/lib/utils'
import format from 'date-fns/format'
import type { TeacherPayoutDetail } from '@/features/payouts/types/payout.types'

/** e.g. "March 2026" from payout_month (YYYY-MM) or period_start */
function formatPayoutMonthYear(payout: {
  payout_month?: string | null
  period_start?: string
}): string {
  if (payout.payout_month && /^\d{4}-\d{2}$/.test(payout.payout_month)) {
    const [y, m] = payout.payout_month.split('-').map(Number)
    return format(new Date(y, m - 1, 1), 'MMMM yyyy')
  }
  if (payout.period_start) {
    return format(new Date(payout.period_start), 'MMMM yyyy')
  }
  return '—'
}

function getCommissionLabel(
  tp: TeacherPayoutDetail,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  switch (tp.commission_type) {
    case 'monthly_percent':
      return `${Number(tp.commission_rate) || 0}%`
    case 'per_session':
      return `${Number(tp.sessions_count) || 0} × ${formatCurrency(tp.per_session_rate)}`
    case 'monthly_salary':
      return t('teacherPayout.detailPage.salaryAllCourses')
    case 'fixed_amount':
      return `${t('teacherPayout.detailPage.commissionFixedAmount')}: ${formatCurrency(tp.payout_amount)}`
    default:
      return '—'
  }
}

function PayoutDetailTitle({
  teacherName,
  monthYear,
  locale,
  t,
}: {
  teacherName: string
  monthYear: string
  locale: string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  if (locale === 'mm') {
    return (
      <>
        <span className="text-primary font-bold">{teacherName}</span>
        <span className="text-foreground font-bold">{t('teacherPayout.detailPage.titleMmBetween')}</span>
        <span className="font-bold text-foreground">{monthYear}</span>
        <span className="text-muted-foreground font-bold">{t('teacherPayout.detailPage.titleMmClose')}</span>
      </>
    )
  }
  return (
    <>
      <span className="text-foreground font-normal">{t('teacherPayout.detailPage.titleEnLead')}</span>
      <span className="text-primary font-bold">{teacherName}</span>
      <span className="text-muted-foreground font-bold">{t('teacherPayout.detailPage.titleEnBetween')}</span>
      <span className="font-bold text-foreground">{monthYear}</span>
      <span className="text-muted-foreground font-bold">{t('teacherPayout.detailPage.titleEnClose')}</span>
    </>
  )
}

function SectionSummaryTitle({
  teacherName,
  monthYear,
  locale,
  t,
  trailingAction,
}: {
  teacherName: string
  monthYear: string
  locale: string
  t: (key: string, params?: Record<string, string | number>) => string
  trailingAction?: ReactNode
}) {
  if (locale === 'mm') {
    return (
      <>
        <span className="inline-flex flex-wrap items-baseline gap-x-1">
          <span className="text-primary">{monthYear}</span>
          <span className="text-foreground">{t('teacherPayout.detailPage.sectionSummaryMmBetweenMonthAndTeacher')}</span>
          <span className="text-primary">{teacherName}</span>
          <span className="text-foreground">{t('teacherPayout.detailPage.sectionSummaryMmSuffix')}</span>
        </span>
        {trailingAction && (
          <span className="ml-4 inline-flex shrink-0">{trailingAction}</span>
        )}
      </>
    )
  }
  return (
    <>
      <span className="inline-flex flex-wrap items-baseline gap-x-1">
        <span className="text-foreground">{t('teacherPayout.detailPage.sectionSummaryLead')}</span>
        <span className="text-primary">{teacherName}</span>
        <span className="text-muted-foreground">{t('teacherPayout.detailPage.sectionSummaryBetween')}</span>
        <span className="text-primary">{monthYear}</span>
      </span>
      {trailingAction && (
        <span className="ml-4 inline-flex shrink-0">{trailingAction}</span>
      )}
    </>
  )
}

function getSummaryTitleText(
  teacherName: string,
  monthYear: string,
  locale: string,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  if (locale === 'mm') {
    return `${monthYear}${t('teacherPayout.detailPage.sectionSummaryMmBetweenMonthAndTeacher')}${teacherName}${t('teacherPayout.detailPage.sectionSummaryMmSuffix')}`
  }
  return `${t('teacherPayout.detailPage.sectionSummaryLead')}${teacherName}${t('teacherPayout.detailPage.sectionSummaryBetween')}${monthYear}`
}

export default function TeacherPayoutDetailPage() {
  const { t, locale } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const payoutId = id ? parseInt(id, 10) : 0
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
  const [bonusModalOpen, setBonusModalOpen] = useState(false)
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)

  const { data: payoutResponse, isLoading, error } = usePayout(payoutId)
  const markAsPaid = useMarkPayoutAsPaid()

  const payout = payoutResponse?.data
  const isPending = payout?.status === 'pending'

  const courseSessionTabs = useMemo(
    () =>
      (payout?.teacher_payouts ?? [])
        .filter((tp) => tp.course)
        .map((tp) => ({
          ...tp,
          sessions: [...(tp.sessions ?? [])].sort((a, b) =>
            a.session_date && b.session_date
              ? new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
              : 0
          ),
        })),
    [payout?.teacher_payouts]
  )

  useEffect(() => {
    const firstId = courseSessionTabs[0]?.course?.id
    setActiveCourseId(firstId ? String(firstId) : null)
  }, [payoutId, courseSessionTabs])

  const handleMarkPaidConfirm = () => {
    if (payout) {
      markAsPaid.mutate(payout.id, {
        onSuccess: () => setMarkPaidDialogOpen(false),
      })
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('teacherPayout.detailPage.title')} backTo="/teacher-payouts" />
        <p className="text-destructive">{(error as Error).message}</p>
      </div>
    )
  }

  if (isLoading || !payout) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('teacherPayout.detailPage.title')} backTo="/teacher-payouts" />
        <p className="text-muted-foreground">{isLoading ? 'Loading...' : 'Payout not found.'}</p>
      </div>
    )
  }

  const periodLabel = payout.period_start && payout.period_end
    ? `${format(new Date(payout.period_start), 'dd MMM yyyy')} – ${format(new Date(payout.period_end), 'dd MMM yyyy')}`
    : payout.payout_month ?? '—'

  const teacherName = safeText(payout.teacher?.name ?? payout.recipient_name)
  const monthYear = formatPayoutMonthYear(payout)

  const rawTotalToPay = Number(payout.total_to_pay ?? payout.total_amount)
  const totalToPayDisplay = Number.isFinite(rawTotalToPay) ? rawTotalToPay : 0

  const summaryLines = payout.teacher_payouts ?? []
  const footerTotalCollected =
    payout.total_collected ??
    summaryLines.reduce((acc, tp) => acc + Number(tp.total_collected ?? 0), 0)
  const footerTotalPayoutToTeacher = summaryLines.reduce(
    (acc, tp) => acc + Number(tp.payout_amount ?? 0),
    0
  )
  const footerTotalSessions = summaryLines.reduce(
    (acc, tp) => acc + (tp.sessions?.length ?? tp.sessions_count ?? 0),
    0
  )

  const defaultCourseTab = courseSessionTabs[0]?.course?.id
    ? String(courseSessionTabs[0].course.id)
    : undefined

  const selectedCourseId = activeCourseId ?? defaultCourseTab ?? null

  const handleExportSummary = () => {
    if (summaryLines.length === 0) return

    const fileMonth = payout.payout_month ?? monthYear.replace(/\s+/g, '-')

    exportPayoutSummaryToExcel({
      title: getSummaryTitleText(teacherName, monthYear, locale, t),
      paymentStatusLabel: t('teacherPayout.detailPage.paymentStatusTitle'),
      paymentStatus: t(`teacherPayout.status.${payout.status}`),
      headers: [
        t('teacherPayout.table.no'),
        t('teacherPayout.detailPage.summaryTeacher'),
        t('teacherPayout.detailPage.summaryPeriod'),
        t('teacherPayout.detailPage.summaryCourseName'),
        t('teacherPayout.detailPage.summaryCoursePrice'),
        t('teacherPayout.detailPage.summaryCollected'),
        t('teacherPayout.detailPage.commission'),
        t('teacherPayout.detailPage.summaryToTeacher'),
        t('teacherPayout.detailPage.totalSessionClass'),
      ],
      rows: summaryLines.map((tp, index) => ({
        no: index + 1,
        teacher: teacherName,
        period: periodLabel,
        course: tp.course
          ? safeText(tp.course.title)
          : t('teacherPayout.detailPage.salaryAllCourses'),
        subject:
          tp.course?.subject && typeof tp.course.subject.name === 'string'
            ? tp.course.subject.name
            : null,
        coursePrice:
          tp.course?.monthly_fee != null
            ? Number(tp.course.monthly_fee)
            : tp.course?.total_fee != null
              ? Number(tp.course.total_fee)
              : null,
        collected: Number(tp.total_collected ?? 0),
        commission: getCommissionLabel(tp, t),
        toTeacher: Number(tp.payout_amount ?? 0),
        sessions: tp.sessions?.length ?? tp.sessions_count ?? 0,
      })),
      footerLabel: t('teacherPayout.detailPage.summaryFooterTotal'),
      footerTotals: {
        collected: footerTotalCollected,
        toTeacher: footerTotalPayoutToTeacher,
        sessions: footerTotalSessions,
      },
      fileName: t('teacherPayout.detailPage.exportSummaryFileName', {
        teacher: teacherName.replace(/\s+/g, '_'),
        month: fileMonth,
      }),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <PayoutDetailTitle
            teacherName={teacherName}
            monthYear={monthYear}
            locale={locale}
            t={t}
          />
        }
        backTo="/teacher-payouts"
        action={
          isPending ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                className="border-payout-bonus/80 text-payout-bonus hover:border-payout-bonus hover:bg-payout-bonus/10 hover:text-payout-bonus"
                onClick={() => setBonusModalOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t('teacherPayout.detailPage.editBonus')}
              </Button>
              <Button variant="default" onClick={() => setMarkPaidDialogOpen(true)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {t('teacherPayout.actions.markPaid')}
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="space-y-4">
        {(payout.bonus_notes ?? '').trim() && (
          <p className="text-sm text-muted-foreground">{payout.bonus_notes}</p>
        )}

        <div
          className="flex items-center gap-2 flex-wrap"
          role="group"
          aria-label={t('teacherPayout.detailPage.amountsEquationAria')}
        >
          <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">{t('teacherPayout.detailPage.summaryCollected')}:</span>
            <span className="font-semibold tabular-nums text-green-600">
              {formatCurrency(footerTotalCollected)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">{t('teacherPayout.detailPage.base')}:</span>
            <span className="font-semibold tabular-nums text-orange-600">
              {formatCurrency(payout.total_amount)}
            </span>
          </div>

          <span className="text-muted-foreground font-medium select-none" aria-hidden>
            +
          </span>

          <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">{t('teacherPayout.detailPage.bonus')}:</span>
            <span className="font-semibold tabular-nums text-amber-600">
              {formatCurrency(payout.bonus_amount ?? 0)}
            </span>
          </div>

          <span className="text-muted-foreground font-medium select-none" aria-hidden>
            =
          </span>

          <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">{t('teacherPayout.detailPage.totalToPay')}:</span>
            <span className="font-semibold tabular-nums text-orange-600">
              {formatCurrency(totalToPayDisplay)}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Summary table (one row per course) */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="font-normal flex flex-wrap items-center gap-4">
            <SectionSummaryTitle
              teacherName={teacherName}
              monthYear={monthYear}
              locale={locale}
              t={t}
              trailingAction={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-black/80 text-black shadow-md hover:border-black hover:bg-black/5 hover:text-black hover:shadow-md"
                  onClick={handleExportSummary}
                  disabled={summaryLines.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('teacherPayout.detailPage.exportSummary')}
                </Button>
              }
            />
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('teacherPayout.detailPage.paymentStatusTitle')}:</span>
            <Badge variant={payout.status === 'paid' ? 'default' : 'warning'} className="text-sm">
              {t(`teacherPayout.status.${payout.status}`)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">{t('teacherPayout.table.no')}</TableHead>
                <TableHead className="w-[140px]">{t('teacherPayout.detailPage.summaryTeacher')}</TableHead>
                <TableHead className="w-[160px]">{t('teacherPayout.detailPage.summaryPeriod')}</TableHead>
                <TableHead className="w-[180px]">{t('teacherPayout.detailPage.summaryCourseName')}</TableHead>
                <TableHead className="w-28">{t('teacherPayout.detailPage.summaryCoursePrice')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.summaryCollected')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.commission')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.summaryToTeacher')}</TableHead>
                <TableHead className="w-24 text-center">{t('teacherPayout.detailPage.totalSessionClass')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryLines.map((tp, index) => (
                <TableRow key={tp.id}>
                  <TableCell className="text-center tabular-nums text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    {payout.teacher ? (
                      typeof payout.teacher.slug === 'string' && payout.teacher.slug ? (
                        <Link
                          to={`/teachers/${payout.teacher.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {safeText(payout.teacher.name ?? payout.teacher.teacher_id)}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {safeText(payout.teacher.name ?? payout.teacher.teacher_id)}
                        </span>
                      )
                    ) : (
                      safeText(payout.recipient_name)
                    )}
                  </TableCell>
                  <TableCell>{periodLabel}</TableCell>
                  <TableCell>
                    {tp.course ? (
                      <div>
                        {typeof tp.course.slug === 'string' && tp.course.slug ? (
                          <Link
                            to={`/courses/${tp.course.slug}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {safeText(tp.course.title)}
                          </Link>
                        ) : (
                          <span className="font-medium">{safeText(tp.course.title)}</span>
                        )}
                        {tp.course.subject && typeof tp.course.subject.name === 'string' && (
                          <div className="text-sm font-medium text-muted-foreground">
                            {tp.course.subject.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium">{t('teacherPayout.detailPage.salaryAllCourses')}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {tp.course?.monthly_fee != null
                      ? formatCurrency(tp.course.monthly_fee)
                      : tp.course?.total_fee != null
                        ? formatCurrency(tp.course.total_fee)
                        : '—'}
                  </TableCell>
                  <TableCell>{formatCurrency(tp.total_collected)}</TableCell>
                  <TableCell>{getCommissionLabel(tp, t)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(tp.payout_amount)}</TableCell>
                  <TableCell className="text-center">
                    {tp.sessions?.length ?? tp.sessions_count ?? 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {summaryLines.length > 0 && (
              <TableFooter>
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-right font-semibold">
                    {t('teacherPayout.detailPage.summaryFooterTotal')}
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums text-medium-blue">
                    {formatCurrency(footerTotalCollected)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell className="font-semibold tabular-nums text-medium-blue">
                    {formatCurrency(footerTotalPayoutToTeacher)}
                  </TableCell>
                  <TableCell className="text-center tabular-nums font-semibold text-medium-blue">
                    {footerTotalSessions}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
          {summaryLines.length === 0 && (
            <p className="text-muted-foreground py-4">{t('teacherPayout.messages.noPayouts')}</p>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Sessions in period (tabs per course) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacherPayout.detailPage.sectionSessions', { period: periodLabel })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">{t('teacherPayout.detailPage.sessionTeacherName')}:</span>
            {payout.teacher?.slug ? (
              <Link
                to={`/teachers/${payout.teacher.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {teacherName}
              </Link>
            ) : (
              <span className="font-medium">{teacherName}</span>
            )}
            {payout.teacher?.email && (
              <span className="text-muted-foreground">({payout.teacher.email})</span>
            )}
          </div>

          {courseSessionTabs.length > 0 && selectedCourseId ? (
            <Tabs
              value={selectedCourseId}
              onValueChange={setActiveCourseId}
              className="space-y-4"
            >
              <div className="overflow-x-auto pb-1 -mx-1 px-1">
                <TabsList className="inline-flex h-auto w-max min-w-full justify-start gap-2 rounded-none border-0 bg-transparent p-0">
                  {courseSessionTabs.map((tp) => {
                    const courseId = String(tp.course!.id)
                    const courseTitle = safeText(tp.course!.title)
                    const subjectName =
                      tp.course?.subject && typeof tp.course.subject.name === 'string'
                        ? tp.course.subject.name
                        : null
                    const sessionCount = tp.sessions.length || tp.sessions_count || 0

                    return (
                      <TabsTrigger
                        key={courseId}
                        value={courseId}
                        className={cn(
                          'h-auto min-w-[200px] max-w-[280px] shrink-0 flex-col items-start rounded-lg border px-3 py-2.5 text-left shadow-none',
                          'data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                          'data-[state=inactive]:border-border data-[state=inactive]:bg-background hover:bg-muted/40'
                        )}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <div className="min-w-0 text-left">
                            <span className="block text-sm font-medium leading-snug line-clamp-2">
                              {courseTitle}
                            </span>
                            {subjectName && (
                              <span className="mt-0.5 block text-xs font-medium text-muted-foreground line-clamp-1">
                                {subjectName}
                              </span>
                            )}
                          </div>
                          <Badge variant="secondary" className="shrink-0 tabular-nums">
                            {sessionCount}
                          </Badge>
                        </div>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>

              {courseSessionTabs.map((tp) => {
                const courseId = String(tp.course!.id)
                const sessions = tp.sessions

                return (
                  <TabsContent key={courseId} value={courseId} className="mt-0 focus-visible:outline-none">
                    {sessions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12 text-center">{t('teacherPayout.detailPage.sessionNo')}</TableHead>
                            <TableHead className="w-28">{t('teacherPayout.detailPage.sessionDate')}</TableHead>
                            <TableHead className="w-[140px]">{t('teacherPayout.detailPage.sessionTeacherName')}</TableHead>
                            <TableHead>{t('teacherPayout.detailPage.sessionTopic')}</TableHead>
                            <TableHead>{t('teacherPayout.detailPage.sessionStatus')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sessions.map((s, index) => (
                            <TableRow key={typeof s.id === 'number' || typeof s.id === 'string' ? s.id : index}>
                              <TableCell className="text-center">{index + 1}</TableCell>
                              <TableCell>
                                {s.session_date ? format(new Date(s.session_date), 'dd MMM yyyy') : '—'}
                              </TableCell>
                              <TableCell>{teacherName}</TableCell>
                              <TableCell className="text-muted-foreground">{s.topic_covered ?? '—'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {safeText(s.status, '')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground">{t('teacherPayout.detailPage.noSessions')}</p>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          ) : (
            <p className="text-muted-foreground">{t('teacherPayout.detailPage.noSessions')}</p>
          )}
        </CardContent>
      </Card>

      <MarkPayoutAsPaidDialog
        open={markPaidDialogOpen}
        onOpenChange={setMarkPaidDialogOpen}
        onConfirm={handleMarkPaidConfirm}
        teacherName={safeText(payout.teacher?.name ?? payout.recipient_name, '') || undefined}
        amount={totalToPayDisplay}
        isLoading={markAsPaid.isPending}
      />

      <EditPayoutBonusModal
        open={bonusModalOpen}
        onOpenChange={setBonusModalOpen}
        payout={payout}
      />
    </div>
  )
}
