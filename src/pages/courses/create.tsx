import { CourseForm } from '@/features/courses/components/CourseForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Create Course Page - Form to create a new course
 */
function CreateCoursePage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('course.pages.create')}
        description={t('course.descriptions.create')}
        backTo="/courses"
      />
      <CourseForm />
    </div>
  )
}

export default CreateCoursePage

