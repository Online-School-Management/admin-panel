import { EnrollmentsList } from '@/features/enrollments/components/EnrollmentsList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Enrollments List Page - Displays a list of all enrollments
 */
function EnrollmentsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.pages.list')}
        description={t('enrollment.descriptions.list')}
        addTo="/enrollments/new"
        addLabel={t('enrollment.actions.create')}
      />
      <EnrollmentsList />
    </div>
  )
}

export default EnrollmentsListPage

