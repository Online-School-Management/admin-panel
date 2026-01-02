import { useParams } from 'react-router-dom'
import { StudentDetail } from '@/features/students/components/StudentDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Student Detail Page - Displays detailed information about a student
 */
function StudentDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('student.pages.detail')}
        description={t('student.descriptions.detail')}
        backTo="/students"
        editTo={slug ? `/students/${slug}/edit` : undefined}
        editLabel={t('student.actions.edit')}
      />
      {slug && <StudentDetail studentSlug={slug} />}
    </div>
  )
}

export default StudentDetailPage

