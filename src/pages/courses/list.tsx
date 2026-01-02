import { CoursesList } from '@/features/courses/components/CoursesList'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Courses List Page - Displays a list of all courses
 */
function CoursesListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('course.pages.list')}
        description={t('course.descriptions.list')}
        addTo="/courses/new"
        addLabel={t('course.actions.create')}
      />
      <CoursesList />
    </div>
  )
}

export default CoursesListPage

