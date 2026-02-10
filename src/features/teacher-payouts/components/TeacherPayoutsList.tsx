import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, CheckCircle2, Search, RefreshCw, CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  useTeacherPayouts,
  useCalculatePayouts,
} from '../hooks/useTeacherPayouts'
import {
  usePayouts,
  useMarkPayoutAsPaid,
  useMarkPayoutsAsPaidBulk,
} from '@/features/payouts/hooks/usePayouts'
import { MarkPayoutAsPaidDialog } from './MarkPayoutAsPaidDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION } from '@/constants'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import type { PayoutItem } from '@/features/payouts/types/payout.types'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'

/**
 * TeacherPayoutsList - main component for teacher payout management
 * Now reads from payouts table (one row per teacher per period)
 * Calculate still uses teacher-payouts endpoint which syncs to payouts
 */
export function TeacherPayoutsList() {
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE

  // Period selection
  const now = new Date()
  const [periodMode, setPeriodMode] = useState<'month' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  )
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Mark as paid dialogs
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null)
  const [bulkMarkPaidDialogOpen, setBulkMarkPaidDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Compute period dates
  const { periodStart, periodEnd, payoutMonth } = useMemo(() => {
    if (periodMode === 'custom' && customStart && customEnd) {
      return {
        periodStart: customStart,
        periodEnd: customEnd,
        payoutMonth: null as string | null,
      }
    }
    // Default month mode
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return {
      periodStart: format(startOfMonth(date), 'yyyy-MM-dd'),
      periodEnd: format(endOfMonth(date), 'yyyy-MM-dd'),
      payoutMonth: selectedMonth,
    }
  }, [periodMode, selectedMonth, customStart, customEnd])

  // Generate month options (last 6 months + current + next 3 months)
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

    // Current month
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

  // Fetch from payouts table (one row per teacher per period)
  const { data, isLoading, error } = usePayouts({
    page,
    per_page: perPage,
    recipient_type: 'teacher',
    period_start: periodStart,
    period_end: periodEnd,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  })

  // Also fetch teacher-payouts period totals (from students)
  const { data: teacherPayoutsData } = useTeacherPayouts({
    page: 1,
    per_page: 1,
    period_start: periodStart,
    period_end: periodEnd,
  })

  // Mutations
  const calculatePayouts = useCalculatePayouts()
  const markAsPaid = useMarkPayoutAsPaid()
  const markAsPaidBulk = useMarkPayoutsAsPaidBulk()

  const payouts = Array.isArray(data?.data) ? data.data : []
  const pagination = data?.meta?.pagination
  const periodTotals = data?.meta?.period_totals
  const teacherPeriodTotals = teacherPayoutsData?.meta?.period_totals

  // Handlers
  const handleCalculate = () => {
    calculatePayouts.mutate({
      period_start: periodStart,
      period_end: periodEnd,
      payout_month: payoutMonth,
    })
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

  const handleBulkMarkPaid = () => {
    const pendingSelected = selectedIds.filter(id =>
      payouts.find(p => p.id === id && p.status === 'pending')
    )
    if (pendingSelected.length === 0) return
    setSelectedIds(pendingSelected)
    setBulkMarkPaidDialogOpen(true)
  }

  const handleBulkMarkPaidConfirm = () => {
    markAsPaidBulk.mutate(
      { ids: selectedIds },
      {
        onSuccess: () => {
          setBulkMarkPaidDialogOpen(false)
          setSelectedIds([])
        },
      }
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(payouts.filter(p => p.status === 'pending').map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id))
    }
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    setPeriodMode('month')
    setCustomStart('')
    setCustomEnd('')
    setPage(1)
    setSelectedIds([])
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(1)
    setSelectedIds([])
  }

  const hasActiveFilters = search !== '' || statusFilter !== 'all'

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
    }).format(amount)

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

  const pendingSelectedCount = selectedIds.filter(id =>
    payouts.find(p => p.id === id && p.status === 'pending')
  ).length

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('common.messages.somethingWentWrong')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Month Buttons - Sticky */}
        <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 lg:-mx-6 xl:-mx-8 px-4 lg:px-6 xl:px-8 pt-4">
          <div className="w-full">
            <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
              <div className="inline-flex w-auto gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap">
                {monthOptions.map((option) => {
                  const isActive = periodMode === 'month' && option.value === selectedMonth
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMonthChange(option.value)}
                      className={cn(
                        'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all',
                        isActive && 'bg-primary-active text-primary shadow-sm font-semibold'
                      )}
                    >
                      {option.shortLabel}
                    </Button>
                  )
                })}
                {/* Custom range button */}
                <Button
                  variant={periodMode === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriodMode('custom')}
                  className={cn(
                    'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all',
                    periodMode === 'custom' && 'bg-primary-active text-primary shadow-sm font-semibold'
                  )}
                >
                  <CalendarRange className="h-4 w-4 mr-1" />
                  {t('teacherPayout.period.custom')}
                </Button>
              </div>
            </div>
          </div>

          {/* Custom date range inputs */}
          {periodMode === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Input
                type="date"
                value={customStart}
                onChange={(e) => { setCustomStart(e.target.value); setPage(1); setSelectedIds([]) }}
                className="w-full sm:w-auto"
              />
              <span className="self-center text-muted-foreground hidden sm:inline">—</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => { setCustomEnd(e.target.value); setPage(1); setSelectedIds([]) }}
                className="w-full sm:w-auto"
              />
            </div>
          )}
        </div>

        {/* Action bar: Calculate + Period Totals + Bulk Mark Paid */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <Button
            onClick={handleCalculate}
            disabled={calculatePayouts.isPending || (periodMode === 'custom' && (!customStart || !customEnd))}
          >
            <Calculator className="h-4 w-4 mr-2" />
            {calculatePayouts.isPending
              ? t('teacherPayout.actions.calculating')
              : t('teacherPayout.actions.calculate')}
          </Button>

          {/* Period totals inline */}
          {(teacherPeriodTotals || periodTotals) && (
            <div className="flex items-center gap-2 flex-wrap">
              {teacherPeriodTotals && (
                <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
                  <span className="text-muted-foreground">{t('teacherPayout.summary.fromStudents')}:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(teacherPeriodTotals.total_from_students)}</span>
                </div>
              )}
              {teacherPeriodTotals && periodTotals && (
                <span className="text-muted-foreground font-medium">−</span>
              )}
              {periodTotals && (
                <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
                  <span className="text-muted-foreground">{t('teacherPayout.summary.toTeachers')}:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(periodTotals.total_to_pay)}</span>
                </div>
              )}
              {teacherPeriodTotals && periodTotals && (
                <>
                  <span className="text-muted-foreground font-medium">=</span>
                  <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
                    <span className="text-muted-foreground">{t('teacherPayout.summary.netBalance')}:</span>
                    <span className={cn(
                      'font-semibold',
                      teacherPeriodTotals.total_from_students - periodTotals.total_to_pay >= 0
                        ? 'text-blue-600'
                        : 'text-red-600'
                    )}>
                      {formatCurrency(teacherPeriodTotals.total_from_students - periodTotals.total_to_pay)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Bulk mark paid - pushed to right */}
          {pendingSelectedCount > 0 && (
            <Button
              variant="default"
              onClick={handleBulkMarkPaid}
              className="sm:ml-auto"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t('teacherPayout.actions.markSelectedPaid', { count: String(pendingSelectedCount) })}
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('teacherPayout.filters.searchTeacher')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => { setStatusFilter(value); setPage(1) }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('teacherPayout.filters.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('teacherPayout.filters.allStatus')}</SelectItem>
              <SelectItem value="pending">{t('teacherPayout.status.pending')}</SelectItem>
              <SelectItem value="paid">{t('teacherPayout.status.paid')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={hasActiveFilters ? 'destructive' : 'outline'}
            onClick={handleReset}
            className="w-full sm:w-auto"
            disabled={!hasActiveFilters}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('teacherPayout.actions.clear')}
          </Button>
        </div>

        {/* Payouts Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
            {isLoading ? (
              <TableSkeleton
                columns={[
                  { width: 'w-8', className: 'w-10' },
                  { width: 'w-8', className: 'w-16' },
                  { width: 'w-32' },
                  { width: 'w-40' },
                  { width: 'w-24' },
                  { width: 'w-24' },
                  { width: 'w-16' },
                ]}
                rows={5}
              />
            ) : payouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {t('teacherPayout.messages.noPayouts')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('teacherPayout.messages.clickCalculate')}
                </p>
              </div>
            ) : (
              <div className="opacity-100 transition-opacity duration-300">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            payouts.filter(p => p.status === 'pending').length > 0 &&
                            payouts
                              .filter(p => p.status === 'pending')
                              .every(p => selectedIds.includes(p.id))
                          }
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead className="w-16 font-bold">{t('teacherPayout.table.no')}</TableHead>
                      <TableHead className="font-bold">{t('teacherPayout.table.teacher')}</TableHead>
                      <TableHead className="font-bold">{t('teacherPayout.table.courses')}</TableHead>
                      <TableHead className="font-bold">{t('teacherPayout.table.amount')}</TableHead>
                      <TableHead className="font-bold">{t('teacherPayout.table.status')}</TableHead>
                      <TableHead className="text-right font-bold">{t('teacherPayout.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout, index) => {
                      const rowNumber = pagination
                        ? (pagination.current_page - 1) * pagination.per_page + index + 1
                        : index + 1

                      return (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {payout.status === 'pending' ? (
                              <Checkbox
                                checked={selectedIds.includes(payout.id)}
                                onCheckedChange={(checked) => handleSelectOne(payout.id, !!checked)}
                              />
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-center">
                            {rowNumber}
                          </TableCell>
                          <TableCell>
                            {payout.teacher ? (
                              <div>
                                <div className="font-medium">
                                  <Link
                                    to={`/teachers/${payout.teacher.slug}`}
                                    className="text-primary hover:underline"
                                  >
                                    {payout.teacher.name ?? payout.teacher.teacher_id}
                                  </Link>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {payout.teacher.teacher_id}
                                </div>
                              </div>
                            ) : (
                              <span>{payout.recipient_name ?? '-'}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {payout.courses_count != null && payout.courses_count > 0 ? (
                                <>
                                  <span className="font-medium">{payout.courses_count}</span>
                                  <span className="text-muted-foreground ml-1">
                                    {payout.courses_count === 1 ? t('teacherPayout.detail.course') : t('teacherPayout.detail.courses')}
                                  </span>
                                  {payout.courses && payout.courses.length > 0 && (
                                    <div className="mt-1 text-xs">
                                      {payout.courses.map((c, i) => (
                                        <span key={c.id}>
                                          {i > 0 && ', '}
                                          <Link
                                            to={`/courses/${c.slug}`}
                                            className="text-primary hover:underline"
                                          >
                                            {c.title}
                                          </Link>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-0.5">
                              <div>
                                <span className="font-medium">{formatCurrency(payout.total_collected ?? 0)}</span>
                                <span className="text-muted-foreground text-xs ml-1">
                                  ({t('teacherPayout.list.collectedFromStudent')})
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold">{formatCurrency(payout.total_amount)}</span>
                                <span className="text-muted-foreground text-xs ml-1">
                                  ({t('teacherPayout.list.toTeacher')})
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(payout.status)}</TableCell>
                          <TableCell className="text-right">
                            {payout.status === 'pending' ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleMarkPaidClick(payout)}
                                className="h-8"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                {t('teacherPayout.actions.markPaid')}
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {payout.paid_at
                                  ? format(new Date(payout.paid_at), 'MMM dd, yyyy')
                                  : '-'}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              itemName={t('teacherPayout.page.title').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Single Mark as Paid Dialog */}
      <MarkPayoutAsPaidDialog
        open={markPaidDialogOpen}
        onOpenChange={setMarkPaidDialogOpen}
        onConfirm={handleMarkPaidConfirm}
        teacherName={selectedPayout?.teacher?.name ?? selectedPayout?.recipient_name}
        amount={selectedPayout?.total_amount}
        isLoading={markAsPaid.isPending}
      />

      {/* Bulk Mark as Paid Dialog */}
      <MarkPayoutAsPaidDialog
        open={bulkMarkPaidDialogOpen}
        onOpenChange={setBulkMarkPaidDialogOpen}
        onConfirm={handleBulkMarkPaidConfirm}
        isBulk
        bulkCount={pendingSelectedCount}
        isLoading={markAsPaidBulk.isPending}
      />
    </>
  )
}
