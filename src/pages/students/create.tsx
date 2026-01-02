import { StudentForm } from '@/features/students/components/StudentForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Student Page - Form to create a new student
 */
function CreateStudentPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('student.pages.create')}
        description={t('student.descriptions.create')}
        backTo="/students"
      />
      <StudentForm />
    </div>
  )
}

export default CreateStudentPage

