import { TeachersList } from '@/features/teachers/components/TeachersList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Teachers List Page - Displays a list of all teachers
 */
function TeachersListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacher.pages.list')}
        description={t('teacher.descriptions.list')}
        addTo="/teachers/new"
        addLabel={t('teacher.actions.create')}
      />
      <TeachersList />
    </div>
  )
}

export default TeachersListPage

