import { useParams } from 'react-router-dom'
import { StudentPaymentDetail } from '@/features/student-payments/components/StudentPaymentDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Student Payment Detail Page - Displays detailed information about a student payment
 */
function StudentPaymentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('studentPayment.pages.detail')}
        description={t('studentPayment.descriptions.detail')}
        backTo="/student-payments"
        editTo={id ? `/student-payments/${id}/edit` : undefined}
        editLabel={t('studentPayment.actions.edit')}
      />
      {id && <StudentPaymentDetail paymentId={parseInt(id)} />}
    </div>
  )
}

export default StudentPaymentDetailPage


