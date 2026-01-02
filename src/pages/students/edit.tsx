import { useParams } from 'react-router-dom'
import { StudentForm } from '@/features/students/components/StudentForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Student Page - Form to edit an existing student
 */
function EditStudentPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('student.pages.edit')}
        description={t('student.descriptions.edit')}
        backTo={slug ? `/students/${slug}` : '/students'}
      />
      <StudentForm studentSlug={slug} />
    </div>
  )
}

export default EditStudentPage

