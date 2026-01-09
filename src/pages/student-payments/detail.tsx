import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StudentPaymentDetail } from '@/features/student-payments/components/StudentPaymentDetail'
import { MarkAsPaidDialog } from '@/features/student-payments/components/MarkAsPaidDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'
import { useStudentPayment, useMarkAsPaidPayment } from '@/features/student-payments/hooks/useStudentPayments'
import { PAYMENT_STATUS, PAYMENT_METHOD } from '@/constants'
import type { UpdateStudentPaymentInput } from '@/features/student-payments/types/student-payment.types'

/**
 * Student Payment Detail Page - Displays detailed information about a student payment
 */
function StudentPaymentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const paymentId = id ? parseInt(id) : 0
  
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false)
  const { data: paymentData } = useStudentPayment(paymentId)
  const markAsPaidPayment = useMarkAsPaidPayment()
  
  const payment = paymentData?.data
  const isPending = payment?.status === PAYMENT_STATUS.PENDING
  
  const handleMarkAsPaidClick = () => {
    setMarkAsPaidDialogOpen(true)
  }
  
  const handleMarkAsPaidConfirm = () => {
    if (payment) {
      const updateData: UpdateStudentPaymentInput = {
        status: PAYMENT_STATUS.PAID,
        payment_date: new Date().toISOString().split('T')[0],
        paid_at: new Date().toISOString(),
        payment_method: (payment.payment_method as 'kbz_pay' | 'aya_pay' | 'kbz_mobile_banking' | 'wave_money') || PAYMENT_METHOD.KBZ_PAY,
        amount_paid: payment.amount_paid || undefined,
      }
      
      markAsPaidPayment.mutate(
        { id: payment.id, data: updateData },
        {
          onSuccess: () => {
            setMarkAsPaidDialogOpen(false)
          },
        }
      )
    }
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('studentPayment.pages.detail')}
        description={t('studentPayment.descriptions.detail')}
        backTo="/student-payments"
        action={
          isPending ? (
            <Button
              variant="default"
              onClick={handleMarkAsPaidClick}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t('studentPayment.actions.markAsPaid')}
            </Button>
          ) : undefined
        }
      />
      {id && <StudentPaymentDetail paymentId={parseInt(id)} />}
      
      {/* Mark as Paid Dialog */}
      <MarkAsPaidDialog
        open={markAsPaidDialogOpen}
        onOpenChange={setMarkAsPaidDialogOpen}
        onConfirm={handleMarkAsPaidConfirm}
        studentName={payment?.enrollment?.student?.name}
        isLoading={markAsPaidPayment.isPending}
      />
    </div>
  )
}

export default StudentPaymentDetailPage


