import { StudentPaymentsList } from '@/features/student-payments/components/StudentPaymentsList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Student Payments List Page - Displays a list of all student payments
 */
function StudentPaymentsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('studentPayment.pages.list')}
        description={t('studentPayment.descriptions.list')}
      />
      <StudentPaymentsList />
    </div>
  )
}

export default StudentPaymentsListPage


