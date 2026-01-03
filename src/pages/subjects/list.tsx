import { SubjectsList } from '@/features/subjects/components/SubjectsList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Subjects List Page - Displays a list of all subjects
 */
function SubjectsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subject.pages.list')}
        description={t('subject.descriptions.list')}
        addTo="/subjects/new"
        addLabel={t('subject.actions.create')}
      />
      <SubjectsList />
    </div>
  )
}

export default SubjectsListPage



