import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Eye, MoreVertical, DollarSign, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useStudentPayments, useDeleteStudentPayment, useMarkAsPaidPayment } from '../hooks/useStudentPayments'
import { DeleteStudentPaymentDialog } from './DeleteStudentPaymentDialog'
import { MarkAsPaidDialog } from './MarkAsPaidDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION, PAYMENT_STATUS, PAYMENT_METHOD } from '@/constants'
import format from 'date-fns/format'
import type { StudentPaymentCollectionItem, UpdateStudentPaymentInput } from '../types/student-payment.types'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'

/**
 * StudentPaymentsList component - displays student payments in a table with CRUD actions
 */
export function StudentPaymentsList() {
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<StudentPaymentCollectionItem | null>(null)
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false)
  const [selectedPaymentForMarkPaid, setSelectedPaymentForMarkPaid] = useState<StudentPaymentCollectionItem | null>(null)

  // Month selector - default to current month
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear())

  // Generate month options for tabs (last 6 months + current + next 6 months)
  const monthOptions = useMemo(() => {
    const options: Array<{ month: number; year: number; label: string; shortLabel: string; value: string }> = []
    const currentDate = new Date()
    
    // Last 6 months
    for (let i = 6; i >= 1; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = `${date.getMonth() + 1}-${date.getFullYear()}`
      options.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: format(date, 'MMMM yyyy'),
        shortLabel: format(date, 'MMM yyyy'),
        value,
      })
    }
    
    // Current month
    const currentValue = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`
    options.push({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      label: format(currentDate, 'MMMM yyyy'),
      shortLabel: format(currentDate, 'MMM yyyy'),
      value: currentValue,
    })
    
    // Next 6 months
    for (let i = 1; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      const value = `${date.getMonth() + 1}-${date.getFullYear()}`
      options.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: format(date, 'MMMM yyyy'),
        shortLabel: format(date, 'MMM yyyy'),
        value,
      })
    }
    
    return options
  }, [])

  const { data, isLoading, error } = useStudentPayments({
    page,
    per_page: perPage,
    month: selectedMonth,
    year: selectedYear,
  })

  const deletePayment = useDeleteStudentPayment()
  const markAsPaidPayment = useMarkAsPaidPayment()

  const handleDeleteClick = (payment: StudentPaymentCollectionItem) => {
    setSelectedPayment(payment)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedPayment) {
      deletePayment.mutate(selectedPayment.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedPayment(null)
        },
      })
    }
  }

  const handleMarkAsPaidClick = (payment: StudentPaymentCollectionItem) => {
    setSelectedPaymentForMarkPaid(payment)
    setMarkAsPaidDialogOpen(true)
  }

  const handleMarkAsPaidConfirm = () => {
    if (selectedPaymentForMarkPaid) {
      const updateData: UpdateStudentPaymentInput = {
        status: PAYMENT_STATUS.PAID,
        payment_date: new Date().toISOString().split('T')[0],
        paid_at: new Date().toISOString(),
        payment_method: (selectedPaymentForMarkPaid.payment_method as 'kbz_pay' | 'aya_pay' | 'kbz_mobile_banking' | 'wave_money') || PAYMENT_METHOD.KBZ_PAY,
        // Keep existing amount_paid if available
        amount_paid: selectedPaymentForMarkPaid.amount_paid || undefined,
      }

      markAsPaidPayment.mutate(
        { id: selectedPaymentForMarkPaid.id, data: updateData },
        {
          onSuccess: () => {
            setMarkAsPaidDialogOpen(false)
            setSelectedPaymentForMarkPaid(null)
          },
        }
      )
    }
  }


  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return '-'
    return t(`studentPayment.paymentMethod.${method}`) || method
  }

  const handleMonthChange = (value: string) => {
    const [month, year] = value.split('-').map(Number)
    setSelectedMonth(month)
    setSelectedYear(year)
    setPage(1)
  }

  const currentMonthValue = `${selectedMonth}-${selectedYear}`

  // Ensure payments is always an array
  const payments = Array.isArray(data?.data) ? data.data : []
  const pagination = data?.meta?.pagination

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const totalStudents = payments.length
    const paidCount = payments.filter((p) => p.status === 'paid').length
    const pendingCount = payments.filter((p) => p.status === 'pending').length
    const paidAmount = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount_paid || 0), 0)
    const collectionRate = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0

    return {
      totalStudents,
      paidCount,
      pendingCount,
      paidAmount,
      collectionRate,
    }
  }, [payments])

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
        {/* Month Buttons */}
        <div className="w-full">
          <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
            <div className="inline-flex w-auto gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap">
              {monthOptions.map((option) => {
                const isActive = option.value === currentMonthValue
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleMonthChange(option.value)}
                    className={cn(
                      "whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all",
                      isActive && "bg-primary-active text-primary shadow-sm font-semibold"
                    )}
                  >
                    {option.shortLabel}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator />

        {/* Monthly Summary Cards */}
        {!isLoading && payments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Students Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{monthlyStats.totalStudents}</p>
              </CardContent>
            </Card>

            {/* Total Paid Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{monthlyStats.paidCount}</p>
              </CardContent>
            </Card>

            {/* Total Pending Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{monthlyStats.pendingCount}</p>
              </CardContent>
            </Card>

            {/* Collection Rate Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collection Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{monthlyStats.collectionRate}%</p>
              </CardContent>
            </Card>

            {/* Collected Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'MMK',
                    minimumFractionDigits: 0,
                  }).format(monthlyStats.paidAmount)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payments Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
              {isLoading ? (
                <TableSkeleton
                  columns={[
                    { width: 'w-8', className: 'w-16' },
                    { width: 'w-32' },
                    { width: 'w-40' },
                    { width: 'w-32' },
                    { width: 'w-24' },
                    { width: 'w-32' },
                    { width: 'w-32' },
                    { width: 'w-24' },
                    { width: 'w-24' },
                    { width: 'w-16' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              ) : payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {t('studentPayment.messages.noPaymentsForMonth') || `No payments found for ${format(new Date(selectedYear, selectedMonth - 1, 1), 'MMMM yyyy')}`}
                  </p>
                </div>
              ) : (
                <div className="opacity-100 transition-opacity duration-300">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('studentPayment.table.no')}</TableHead>
                        <TableHead>{t('studentPayment.table.student')}</TableHead>
                        <TableHead>{t('studentPayment.table.course')}</TableHead>
                        <TableHead>{t('studentPayment.table.monthNumber')}</TableHead>
                        <TableHead>{t('studentPayment.table.amount')}</TableHead>
                        <TableHead>{t('studentPayment.table.dueDate')}</TableHead>
                        <TableHead>{t('studentPayment.table.paymentDate')}</TableHead>
                        <TableHead>{t('studentPayment.table.paymentMethod')}</TableHead>
                        <TableHead>{t('studentPayment.table.status')}</TableHead>
                        <TableHead className="text-right">{t('studentPayment.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell>
                              {payment.enrollment?.student ? (
                                <div>
                                  <div className="font-medium">
                                    <Link
                                      to={`/students/${payment.enrollment.student.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {payment.enrollment.student.name}
                                    </Link>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {payment.enrollment.student.student_id}
                                  </div>
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {payment.enrollment?.course ? (
                                <div>
                                  <div className="font-medium">
                                    <Link
                                      to={`/courses/${payment.enrollment.course.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {payment.enrollment.course.title}
                                    </Link>
                                  </div>
                                  {payment.enrollment.course.subject && (
                                    <div className="text-sm text-muted-foreground">
                                      {payment.enrollment.course.subject.name}
                                    </div>
                                  )}
                                  {payment.enrollment.course.start_date && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {format(new Date(payment.enrollment.course.start_date), 'MMM dd, yyyy')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {t('studentPayment.monthNumber', { number: payment.month_number })}
                            </TableCell>
                            <TableCell>
                              {payment.amount_paid
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'MMK',
                                    minimumFractionDigits: 0,
                                  }).format(payment.amount_paid)
                                : '-'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {payment.due_date
                                ? format(new Date(payment.due_date), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {payment.payment_date
                                ? format(new Date(payment.payment_date), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {payment.payment_method ? (
                                <Badge variant="outline">
                                  {getPaymentMethodLabel(payment.payment_method)}
                                </Badge>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(payment.status)}>
                                {getStatusLabel(payment.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {payment.status === PAYMENT_STATUS.PENDING && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleMarkAsPaidClick(payment)}
                                    className="h-8"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    {t('studentPayment.actions.markAsPaid')}
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/student-payments/${payment.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        {t('studentPayment.actions.view')}
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(payment)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {t('studentPayment.actions.delete')}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
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
              itemName={t('studentPayment.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteStudentPaymentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        paymentId={selectedPayment?.id || 0}
        isLoading={deletePayment.isPending}
      />

      {/* Mark as Paid Dialog */}
      <MarkAsPaidDialog
        open={markAsPaidDialogOpen}
        onOpenChange={setMarkAsPaidDialogOpen}
        onConfirm={handleMarkAsPaidConfirm}
        studentName={selectedPaymentForMarkPaid?.enrollment?.student?.name}
        isLoading={markAsPaidPayment.isPending}
      />
    </>
  )
}
