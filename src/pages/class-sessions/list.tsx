import { ClassSessionsGrid } from '@/features/class-sessions/components'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Class Sessions List Page - shows sessions grouped by date (yesterday / today / tomorrow + custom date).
 */
function ClassSessionsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('classSession.page.title')}
        description={t('classSession.page.description')}
      />
      <ClassSessionsGrid />
    </div>
  )
}

export default ClassSessionsListPage
