import { useParams } from 'react-router-dom'
import { TeacherDetail } from '@/features/teachers/components/TeacherDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Teacher Detail Page - Displays detailed information about a teacher
 */
function TeacherDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacher.pages.detail')}
        description={t('teacher.descriptions.detail')}
        backTo="/teachers"
        editTo={id ? `/teachers/${id}/edit` : undefined}
        editLabel={t('teacher.actions.edit')}
      />
      {id && <TeacherDetail teacherId={id} />}
    </div>
  )
}

export default TeacherDetailPage

