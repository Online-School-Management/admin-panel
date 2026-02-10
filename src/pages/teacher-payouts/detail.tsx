import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/i18n/context'
import { usePayout, useMarkPayoutAsPaid } from '@/features/payouts/hooks/usePayouts'
import { MarkPayoutAsPaidDialog } from '@/features/teacher-payouts/components/MarkPayoutAsPaidDialog'
import format from 'date-fns/format'
import type { PayoutSession, TeacherPayoutDetail } from '@/features/payouts/types/payout.types'

/** Flat session row for the sessions table (session + course name + teacher name) */
interface FlatSession extends PayoutSession {
  course_name: string
  teacher_name: string
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
  }).format(amount)
}

function getCommissionLabel(tp: TeacherPayoutDetail, t: (key: string) => string): string {
  switch (tp.commission_type) {
    case 'monthly_percent':
      return `${tp.commission_rate ?? 0}%`
    case 'per_session':
      return `${tp.sessions_count} × ${formatCurrency(tp.per_session_rate ?? 0)}`
    case 'monthly_salary':
      return t('teacherPayout.detailPage.salaryAllCourses')
    default:
      return '—'
  }
}

export default function TeacherPayoutDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const payoutId = id ? parseInt(id, 10) : 0
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)

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

  const teacherName = payout.teacher?.name ?? payout.recipient_name ?? '—'

  // Flat list of all sessions in the period (from all courses), sorted by date
  const flatSessions: FlatSession[] = (payout.teacher_payouts ?? [])
    .flatMap((tp) =>
      (tp.sessions ?? []).map((s) => ({
        ...s,
        course_name: tp.course?.title ?? '—',
        teacher_name: teacherName,
      }))
    )
    .sort((a, b) => (a.session_date && b.session_date ? new Date(a.session_date).getTime() - new Date(b.session_date).getTime() : 0))

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacherPayout.detailPage.titleWithTeacher', { teacherName })}
        description={t('teacherPayout.detailPage.description')}
        backTo="/teacher-payouts"
        action={
          isPending ? (
            <Button variant="default" onClick={() => setMarkPaidDialogOpen(true)}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t('teacherPayout.actions.markPaid')}
            </Button>
          ) : undefined
        }
      />

      {/* Section 1: Summary table (one row per course) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacherPayout.detailPage.sectionSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">{t('teacherPayout.detailPage.summaryTeacher')}</TableHead>
                <TableHead className="w-[160px]">{t('teacherPayout.detailPage.summaryPeriod')}</TableHead>
                <TableHead className="w-[180px]">{t('teacherPayout.detailPage.summaryCourseName')}</TableHead>
                <TableHead className="w-28">{t('teacherPayout.detailPage.summaryCoursePrice')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.summaryCollected')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.commission')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.summaryToTeacher')}</TableHead>
                <TableHead className="w-24 text-center">{t('teacherPayout.detailPage.totalSessionClass')}</TableHead>
                <TableHead>{t('teacherPayout.detailPage.summaryStatus')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(payout.teacher_payouts ?? []).map((tp) => (
                <TableRow key={tp.id}>
                  <TableCell>
                    {payout.teacher ? (
                      <Link to={`/teachers/${payout.teacher.slug}`} className="text-primary hover:underline font-medium">
                        {payout.teacher.name ?? payout.teacher.teacher_id}
                      </Link>
                    ) : (
                      payout.recipient_name ?? '—'
                    )}
                  </TableCell>
                  <TableCell>{periodLabel}</TableCell>
                  <TableCell className="font-medium">
                    {tp.course ? (
                      <Link to={`/courses/${tp.course.slug}`} className="text-primary hover:underline">
                        {tp.course.title}
                      </Link>
                    ) : (
                      t('teacherPayout.detailPage.salaryAllCourses')
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
                  <TableCell>
                    <Badge variant={payout.status === 'paid' ? 'default' : 'warning'}>
                      {t(`teacherPayout.status.${payout.status}`)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(!payout.teacher_payouts || payout.teacher_payouts.length === 0) && (
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
                  <TableRow key={s.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>{s.session_date ? format(new Date(s.session_date), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell>{s.course_name}</TableCell>
                    <TableCell>{s.teacher_name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.topic_covered ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {s.status}
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
        teacherName={payout.teacher?.name ?? payout.recipient_name}
        amount={payout.total_amount}
        isLoading={markAsPaid.isPending}
      />
    </div>
  )
}
