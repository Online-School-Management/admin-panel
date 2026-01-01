import { useParams } from 'react-router-dom'
import { TeacherDetail } from '@/features/teachers/components/TeacherDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Teacher Detail Page - Displays detailed information about a teacher
 */
function TeacherDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacher.pages.detail')}
        description={t('teacher.descriptions.detail')}
        backTo="/teachers"
        editTo={slug ? `/teachers/${slug}/edit` : undefined}
        editLabel={t('teacher.actions.edit')}
      />
      {slug && <TeacherDetail teacherSlug={slug} />}
    </div>
  )
}

export default TeacherDetailPage

