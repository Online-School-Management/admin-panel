import { StudentsList } from '@/features/students/components/StudentsList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Students List Page - Displays a list of all students
 */
function StudentsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('student.pages.list')}
        description={t('student.descriptions.list')}
        addTo="/students/new"
        addLabel={t('student.actions.create')}
      />
      <StudentsList />
    </div>
  )
}

export default StudentsListPage

