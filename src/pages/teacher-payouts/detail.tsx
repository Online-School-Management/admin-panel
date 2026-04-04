import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatCurrency, safeText } from '@/utils/format'
import format from 'date-fns/format'
import type { PayoutSession, TeacherPayoutDetail } from '@/features/payouts/types/payout.types'

/** Flat session row for the sessions table (session + course name + subject + teacher name) */
interface FlatSession extends PayoutSession {
  course_name: string
  course_subject: string | null
  teacher_name: string
}

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

export default function TeacherPayoutDetailPage() {
  const { t, locale } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const payoutId = id ? parseInt(id, 10) : 0
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
  const [bonusModalOpen, setBonusModalOpen] = useState(false)

  const { data: payoutResponse, isLoading, error } = usePayout(payoutId)
  const markAsPaid = useMarkPayoutAsPaid()

  const payout = payoutResponse?.data
  const isPending = payout?.status === 'pending'

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

  // Flat list of all sessions in the period (from all courses), sorted by date
  const flatSessions: FlatSession[] = summaryLines
    .flatMap((tp) =>
      (tp.sessions ?? []).map((s) => ({
        ...s,
        course_name: safeText(tp.course?.title),
        course_subject:
          tp.course?.subject && typeof tp.course.subject.name === 'string'
            ? tp.course.subject.name
            : null,
        teacher_name: teacherName,
      }))
    )
    .sort((a, b) => (a.session_date && b.session_date ? new Date(a.session_date).getTime() - new Date(b.session_date).getTime() : 0))

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
        description={t('teacherPayout.detailPage.description')}
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

      <div className="grid grid-cols-12 gap-6 items-start">
        <Card className="col-span-12 md:col-span-4">
          <CardContent className="space-y-4 pt-6">
            {(payout.bonus_notes ?? '').trim() && (
              <p className="text-sm text-muted-foreground">{payout.bonus_notes}</p>
            )}
            <dl className="space-y-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-muted-foreground">{t('teacherPayout.detailPage.summaryCollected')}</dt>
                <dd className="tabular-nums font-medium text-medium-blue">
                  {formatCurrency(footerTotalCollected)}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-muted-foreground">{t('teacherPayout.detailPage.base')}</dt>
                <dd className="tabular-nums font-medium text-medium-blue">
                  {formatCurrency(payout.total_amount)}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="font-medium text-payout-bonus">{t('teacherPayout.detailPage.bonus')}</dt>
                <dd className="tabular-nums font-semibold text-payout-bonus">
                  {formatCurrency(payout.bonus_amount ?? 0)}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t pt-3">
                <dt className="font-semibold text-foreground">{t('teacherPayout.detailPage.totalToPay')}</dt>
                <dd className="tabular-nums font-semibold text-medium-blue">
                  {formatCurrency(totalToPayDisplay)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-3">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-base">{t('teacherPayout.detailPage.paymentStatusTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={payout.status === 'paid' ? 'default' : 'warning'} className="text-sm">
              {t(`teacherPayout.status.${payout.status}`)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: Summary table (one row per course) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacherPayout.detailPage.sectionSummary')}</CardTitle>
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

      {/* Section 2: Sessions in period (one flat table) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacherPayout.detailPage.sectionSessions', { period: periodLabel })}</CardTitle>
        </CardHeader>
        <CardContent>
          {flatSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">{t('teacherPayout.detailPage.sessionNo')}</TableHead>
                  <TableHead className="w-28">{t('teacherPayout.detailPage.sessionDate')}</TableHead>
                  <TableHead className="w-[180px]">{t('teacherPayout.detailPage.sessionCourseName')}</TableHead>
                  <TableHead className="w-[140px]">{t('teacherPayout.detailPage.sessionTeacherName')}</TableHead>
                  <TableHead>{t('teacherPayout.detailPage.sessionTopic')}</TableHead>
                  <TableHead>{t('teacherPayout.detailPage.sessionStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flatSessions.map((s, index) => (
                  <TableRow key={typeof s.id === 'number' || typeof s.id === 'string' ? s.id : index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{s.session_date ? format(new Date(s.session_date), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell>
                      <div>
                        <span>{s.course_name}</span>
                        {s.course_subject && (
                          <div className="text-sm font-medium text-muted-foreground">
                            {s.course_subject}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{s.teacher_name}</TableCell>
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
