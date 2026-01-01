import { TeacherForm } from '@/features/teachers/components/TeacherForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Teacher Page - Form to create a new teacher
 */
function CreateTeacherPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('teacher.pages.create')}
        description={t('teacher.descriptions.create')}
        backTo="/teachers"
      />
      <TeacherForm />
    </div>
  )
}

export default CreateTeacherPage

