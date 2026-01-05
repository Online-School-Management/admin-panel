import { useParams } from 'react-router-dom'
import { StudentPaymentForm } from '@/features/student-payments/components/StudentPaymentForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Student Payment Edit Page - Edit a student payment
 */
function EditStudentPaymentPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('studentPayment.pages.edit')}
        description={t('studentPayment.descriptions.edit')}
        backTo={id ? `/student-payments/${id}` : '/student-payments'}
      />
      {id && <StudentPaymentForm paymentId={parseInt(id)} />}
    </div>
  )
}

export default EditStudentPaymentPage


