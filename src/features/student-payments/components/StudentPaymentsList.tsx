import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStudentPayments, useDeleteStudentPayment } from '../hooks/useStudentPayments'
import { DeleteStudentPaymentDialog } from './DeleteStudentPaymentDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION, PAYMENT_STATUS_OPTIONS } from '@/constants'
import format from 'date-fns/format'
import type { StudentPaymentCollectionItem } from '../types/student-payment.types'
import { useTranslation } from '@/i18n/context'

/**
 * StudentPaymentsList component - displays student payments in a table with CRUD actions
 */
export function StudentPaymentsList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<StudentPaymentCollectionItem | null>(null)

  const { data, isLoading, error } = useStudentPayments({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  })

  const deletePayment = useDeleteStudentPayment()

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

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
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

  // Ensure payments is always an array
  const payments = Array.isArray(data?.data) ? data.data : []
  const pagination = data?.meta?.pagination

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
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('studentPayment.filters.searchPayments')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('studentPayment.filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('studentPayment.filters.allStatus')}</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {getStatusLabel(status.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('studentPayment.actions.clear')}
          </Button>
        </div>

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
                    {search || statusFilter !== 'all'
                      ? t('studentPayment.messages.noPaymentsFound')
                      : t('studentPayment.messages.noPayments')}
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
                                  <div className="font-medium">{payment.enrollment.student.name}</div>
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
                                  <div className="font-medium">{payment.enrollment.course.title}</div>
                                  {payment.enrollment.course.subject && (
                                    <div className="text-sm text-muted-foreground">
                                      {payment.enrollment.course.subject.name}
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
                                  <DropdownMenuItem asChild>
                                    <Link to={`/student-payments/${payment.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('studentPayment.actions.edit')}
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
    </>
  )
}

