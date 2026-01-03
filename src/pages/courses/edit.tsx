import { useParams } from 'react-router-dom'
import { CourseForm } from '@/features/courses/components/CourseForm'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Edit Course Page - Form to edit an existing course
 */
function EditCoursePage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('course.pages.edit')}
        description={t('course.descriptions.edit')}
        backTo={slug ? `/courses/${slug}` : '/courses'}
      />
      <CourseForm courseSlug={slug} />
    </div>
  )
}

export default EditCoursePage



