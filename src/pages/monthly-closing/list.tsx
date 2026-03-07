import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Plus, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  usePayouts,
  useMonthlyClosingSummary,
  useMarkPayoutAsPaid,
} from '@/features/payouts/hooks/usePayouts'
import { useCalculatePayouts } from '@/features/teacher-payouts/hooks/useTeacherPayouts'
import { AddPayoutModal } from '@/features/payouts/components/AddPayoutModal'
import { MarkPayoutAsPaidDialog } from '@/features/teacher-payouts/components/MarkPayoutAsPaidDialog'
import { useQueryClient } from '@tanstack/react-query'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import type { PayoutItem } from '@/features/payouts/types/payout.types'

const TYPE_KEYS: Record<string, string> = {
  teacher: 'monthlyClosing.type.teacher',
  admin: 'monthlyClosing.type.admin',
  server: 'monthlyClosing.type.server',
  facebook: 'monthlyClosing.type.facebook',
  domain: 'monthlyClosing.type.domain',
  content_writer: 'monthlyClosing.type.content_writer',
  other: 'monthlyClosing.type.other',
}

export default function MonthlyClosingListPage() {
  const { t } = useTranslation()
  const [addPayoutOpen, setAddPayoutOpen] = useState(false)
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null)

  const now = new Date()
  const [periodMode, setPeriodMode] = useState<'month' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  )
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')

  const { periodStart, periodEnd, payoutMonth } = useMemo(() => {
    if (periodMode === 'custom' && customStart && customEnd) {
      return {
        periodStart: customStart,
        periodEnd: customEnd,
        payoutMonth: null as string | null,
      }
    }
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return {
      periodStart: format(startOfMonth(date), 'yyyy-MM-dd'),
      periodEnd: format(endOfMonth(date), 'yyyy-MM-dd'),
      payoutMonth: selectedMonth,
    }
  }, [periodMode, selectedMonth, customStart, customEnd])

  const monthOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; shortLabel: string }> = []
    const currentDate = new Date()
    for (let i = 6; i >= 1; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      options.push({
        value,
        label: format(date, 'MMMM yyyy'),
        shortLabel: format(date, 'MMM yyyy'),
      })
    }
    const currentValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    options.push({
      value: currentValue,
      label: format(currentDate, 'MMMM yyyy'),
      shortLabel: format(currentDate, 'MMM yyyy'),
    })
    for (let i = 1; i <= 3; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      options.push({
        value,
        label: format(date, 'MMMM yyyy'),
        shortLabel: format(date, 'MMM yyyy'),
      })
    }
    return options
  }, [])

  const queryClient = useQueryClient()
  const { data: summaryResponse } = useMonthlyClosingSummary(periodStart, periodEnd)
  const summaryData = summaryResponse?.data
  const { data: payoutsResponse, isLoading, error } = usePayouts({
    period_start: periodStart,
    period_end: periodEnd,
    per_page: 0,
  })
  const { data: teacherPayoutsResponse } = usePayouts({
    page: 1,
    per_page: 1,
    recipient_type: 'teacher',
    period_start: periodStart,
    period_end: periodEnd,
  })

  const markAsPaid = useMarkPayoutAsPaid()
  const calculatePayouts = useCalculatePayouts()
  const payouts = Array.isArray(payoutsResponse?.data) ? payoutsResponse.data : []
  const hasTeacherPayoutsForPeriod =
    (teacherPayoutsResponse?.meta?.pagination?.total ?? 0) > 0

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    setPeriodMode('month')
    setCustomStart('')
    setCustomEnd('')
  }

  const handleCalculate = () => {
    calculatePayouts.mutate(
      {
        period_start: periodStart,
        period_end: periodEnd,
        payout_month: payoutMonth ?? undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['payouts', 'monthly-closing-summary'] })
        },
      }
    )
  }

  const handleMarkPaidClick = (payout: PayoutItem) => {
    setSelectedPayout(payout)
    setMarkPaidDialogOpen(true)
  }

  const handleMarkPaidConfirm = () => {
    if (selectedPayout) {
      markAsPaid.mutate(selectedPayout.id, {
        onSuccess: () => {
          setMarkPaidDialogOpen(false)
          setSelectedPayout(null)
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default">{t('teacherPayout.status.paid')}</Badge>
      case 'pending':
        return <Badge variant="warning">{t('teacherPayout.status.pending')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDisplayName = (payout: PayoutItem) =>
    payout.teacher?.name ?? payout.recipient_name ?? '-'

  const getTypeLabel = (type: string) =>
    TYPE_KEYS[type] ? t(TYPE_KEYS[type]) : type

  const periodValid = periodMode !== 'custom' || (customStart && customEnd)

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('common.messages.somethingWentWrong')}: {(error as Error).message}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Period selector */}
        <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 lg:-mx-6 xl:-mx-8 px-4 lg:px-6 xl:px-8 pt-4">
          <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2">
            <div className="inline-flex gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap">
              {monthOptions.map((option) => {
                const isActive = periodMode === 'month' && option.value === selectedMonth
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleMonthChange(option.value)}
                    className={cn(
                      'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm flex-shrink-0',
                      isActive && 'font-semibold'
                    )}
                  >
                    {option.shortLabel}
                  </Button>
                )
              })}
              <Button
                variant={periodMode === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriodMode('custom')}
                className={cn(
                  'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm flex-shrink-0',
                  periodMode === 'custom' && 'font-semibold'
                )}
              >
                <CalendarRange className="h-4 w-4 mr-1" />
                {t('monthlyClosing.period.custom')}
              </Button>
            </div>
          </div>
          {periodMode === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full sm:w-auto"
              />
              <span className="self-center text-muted-foreground hidden sm:inline">—</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
          )}
        </div>

        {/* Horizontal layout: Payouts table (left) | Summary table (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,9fr)_minmax(0,3fr)] gap-4 lg:gap-6">
          {/* Left: Calculate payout + Add payout + Payouts table */}
          <div className="min-w-0 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCalculate}
                disabled={!periodValid || calculatePayouts.isPending}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {calculatePayouts.isPending
                  ? t('monthlyClosing.actions.calculating')
                  : hasTeacherPayoutsForPeriod
                    ? t('monthlyClosing.actions.reCalculate')
                    : t('monthlyClosing.actions.calculatePayout')}
              </Button>
              <Button
                onClick={() => setAddPayoutOpen(true)}
                disabled={!periodValid}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('monthlyClosing.actions.addPayout')}
              </Button>
            </div>

            <div className="rounded-md border relative min-h-[300px]">
          {isLoading ? (
            <TableSkeleton
              columns={[
                { width: 'w-12', className: 'w-12' },
                { width: 'w-40' },
                { width: 'w-32' },
                { width: 'w-24' },
                { width: 'w-20' },
                { width: 'w-28' },
              ]}
              rows={8}
            />
          ) : !periodValid ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <CalendarRange className="h-10 w-10 mb-2 opacity-50" />
              <p>Select a month or enter a custom date range.</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p>{t('monthlyClosing.messages.noPayouts')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 font-bold">{t('monthlyClosing.table.no')}</TableHead>
                  <TableHead className="font-bold">{t('monthlyClosing.table.name')}</TableHead>
                  <TableHead className="font-bold">{t('monthlyClosing.table.course')}</TableHead>
                  <TableHead className="font-bold">{t('monthlyClosing.table.amount')}</TableHead>
                  <TableHead className="font-bold">{t('monthlyClosing.table.status')}</TableHead>
                  <TableHead className="text-right font-bold">{t('monthlyClosing.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout, index) => {
                  const rowNumber = index + 1
                  return (
                    <TableRow key={payout.id}>
                      <TableCell className="text-muted-foreground">{rowNumber}</TableCell>
                      <TableCell>
                        <div>
                          {payout.recipient_type === 'teacher' && payout.teacher ? (
                            <Link
                              to={`/teachers/${payout.teacher.slug}`}
                              className="text-primary hover:underline font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {getDisplayName(payout)}
                            </Link>
                          ) : (
                            <span className="font-medium">{getDisplayName(payout)}</span>
                          )}
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {getTypeLabel(payout.recipient_type)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payout.recipient_type === 'teacher' &&
                        (payout.courses_count != null && payout.courses_count > 0) ? (
                          <div className="text-sm">
                            <span className="font-medium">{payout.courses_count}</span>
                            <span className="text-muted-foreground ml-1">
                              {payout.courses_count === 1
                                ? t('teacherPayout.detail.course')
                                : t('teacherPayout.detail.courses')}
                            </span>
                            {payout.courses && payout.courses.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {payout.courses.map((c) => (
                                  <div key={c.id}>
                                    <Link
                                      to={`/courses/${c.slug}`}
                                      className="text-primary hover:underline text-xs"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {c.title}
                                    </Link>
                                    {c.subject && (
                                      <div className="text-xs font-medium text-muted-foreground">
                                        {c.subject.name}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(payout.total_amount)}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payout.recipient_type === 'teacher' && (
                            <Button variant="outline" size="sm" asChild className="h-8">
                              <Link
                                to={`/teacher-payouts/${payout.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t('monthlyClosing.actions.view')}
                              </Link>
                            </Button>
                          )}
                          {payout.status === 'pending' ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkPaidClick(payout)}
                              className="h-8"
                            >
                              {t('monthlyClosing.actions.markPaid')}
                            </Button>
                          ) : (
                            payout.paid_at && (
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(payout.paid_at), 'MMM dd, yyyy')}
                              </span>
                            )
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
            </div>
          </div>

          {/* Right: Summary table */}
          {periodValid && (
            <div>
              <Card className="h-fit">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {t('monthlyClosing.summary.title')}
                  </h3>
                  {summaryData ? (
                    <div className="space-y-0 text-sm">
                      <div className="flex justify-between items-baseline gap-2 py-2">
                        <span className="font-medium">{t('monthlyClosing.summary.fromStudents')}</span>
                        <span>{formatCurrency(summaryData.from_students)}</span>
                      </div>
                      <div className="border-t border-border my-2" role="presentation" />
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.allTeachers')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.teacher)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.admin')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.admin)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.server')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.server)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.facebook')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.facebook)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.domain')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.domain)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.contentWriter')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.content_writer)}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2 py-1">
                        <span>{t('monthlyClosing.summary.other')}</span>
                        <span className="text-muted-foreground">− {formatCurrency(summaryData.summary.other)}</span>
                      </div>
                      <div className="border-t border-border my-2" role="presentation" />
                      <div className="flex justify-between items-baseline gap-2 pt-2 pb-1">
                        <span className="font-semibold">{t('monthlyClosing.summary.balance')}</span>
                        <span
                          className={cn(
                            'font-semibold',
                            summaryData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {formatCurrency(summaryData.balance)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4">Loading summary…</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AddPayoutModal
        open={addPayoutOpen}
        onOpenChange={setAddPayoutOpen}
        periodStart={periodStart}
        periodEnd={periodEnd}
        payoutMonth={payoutMonth}
      />

      <MarkPayoutAsPaidDialog
        open={markPaidDialogOpen}
        onOpenChange={setMarkPaidDialogOpen}
        onConfirm={handleMarkPaidConfirm}
        teacherName={selectedPayout ? getDisplayName(selectedPayout) : undefined}
        amount={selectedPayout?.total_amount}
        isLoading={markAsPaid.isPending}
      />
    </div>
  )
}
