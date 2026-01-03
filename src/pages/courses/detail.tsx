import { useParams } from 'react-router-dom'
import { CourseDetail } from '@/features/courses/components/CourseDetail'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Course Detail Page - Displays detailed information about a course
 */
function CourseDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('course.pages.detail')}
        description={t('course.descriptions.detail')}
        backTo="/courses"
        editTo={slug ? `/courses/${slug}/edit` : undefined}
        editLabel={t('course.actions.edit')}
      />
      {slug && <CourseDetail courseSlug={slug} />}
    </div>
  )
}

export default CourseDetailPage



