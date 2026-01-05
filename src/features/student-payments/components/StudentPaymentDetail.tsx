import { Calendar, DollarSign, CreditCard, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useStudentPayment } from '../hooks/useStudentPayments'
import format from 'date-fns/format'
import type { StudentPayment } from '../types/student-payment.types'
import { useTranslation } from '@/i18n/context'

interface StudentPaymentDetailProps {
  paymentId: number
}

/**
 * StudentPaymentDetail component - displays detailed student payment information
 */
export function StudentPaymentDetail({ paymentId }: StudentPaymentDetailProps) {
  const { t } = useTranslation()
  const { data: paymentData, isLoading, error } = useStudentPayment(paymentId)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('studentPayment.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!paymentData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('studentPayment.messages.paymentNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const payment: StudentPayment = paymentData.data

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('studentPayment.detail.paymentInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('studentPayment.detail.monthNumber')}
                  </p>
                  <p className="text-base font-semibold">
                    {t('studentPayment.monthNumber', { number: payment.month_number })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t('studentPayment.detail.amount')}
                  </p>
                  <p className="text-base font-semibold">
                    {payment.amount_paid
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'MMK',
                          minimumFractionDigits: 0,
                        }).format(payment.amount_paid)
                      : '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('studentPayment.detail.dueDate')}
                  </p>
                  <p className="text-base">
                    {payment.due_date
                      ? format(new Date(payment.due_date), 'MMM dd, yyyy')
                      : '-'}
                  </p>
                </div>
                {payment.payment_date && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('studentPayment.detail.paymentDate')}
                    </p>
                    <p className="text-base">
                      {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                {payment.paid_at && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('studentPayment.detail.paidAt')}
                    </p>
                    <p className="text-base">
                      {format(new Date(payment.paid_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t('studentPayment.detail.paymentMethod')}
                  </p>
                  {payment.payment_method ? (
                    <Badge variant="outline">
                      {getPaymentMethodLabel(payment.payment_method)}
                    </Badge>
                  ) : (
                    <p className="text-base">-</p>
                  )}
                </div>
                {payment.received_by_admin && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('studentPayment.detail.receivedBy')}
                    </p>
                    <p className="text-base">{payment.received_by_admin.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.received_by_admin.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Information */}
          {payment.enrollment && (
            <Card>
              <CardHeader>
                <CardTitle>{t('studentPayment.detail.enrollmentInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.enrollment.student && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('studentPayment.detail.student')}
                        </p>
                        <p className="text-base font-semibold">{payment.enrollment.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.enrollment.student.student_id}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('common.labels.email')}
                        </p>
                        <p className="text-base">{payment.enrollment.student.email}</p>
                      </div>
                    </>
                  )}
                  {payment.enrollment.course && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('studentPayment.detail.course')}
                        </p>
                        <p className="text-base font-semibold">{payment.enrollment.course.title}</p>
                        {payment.enrollment.course.subject && (
                          <p className="text-sm text-muted-foreground">
                            {payment.enrollment.course.subject.name}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {payment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('studentPayment.detail.notes')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">{payment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('studentPayment.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={getStatusBadgeVariant(payment.status)} className="text-base px-3 py-1">
                {getStatusLabel(payment.status)}
              </Badge>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('studentPayment.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payment.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('studentPayment.detail.created')}
                  </p>
                  <p className="text-base text-sm">
                    {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {payment.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('studentPayment.detail.updated')}
                    </p>
                    <p className="text-base text-sm">
                      {format(new Date(payment.updated_at), 'MMM dd, yyyy HH:mm')}
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


