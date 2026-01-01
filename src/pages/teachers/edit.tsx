import { useParams } from 'react-router-dom'
import { TeacherForm } from '@/features/teachers/components/TeacherForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Teacher Page - Form to edit an existing teacher
 */
function EditTeacherPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacher.pages.edit')}
        description={t('teacher.descriptions.edit')}
        backTo={slug ? `/teachers/${slug}` : '/teachers'}
      />
      <TeacherForm teacherSlug={slug} />
    </div>
  )
}

export default EditTeacherPage

