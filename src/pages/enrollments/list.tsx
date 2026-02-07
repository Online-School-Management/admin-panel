import { EnrollmentCoursesGrid } from '@/features/enrollments/components/EnrollmentCoursesGrid'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Enrollments List Page - Displays upcoming/in-progress courses in a grid.
 * Clicking a course navigates to its enrollment management page.
 */
function EnrollmentsListPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.courseGrid.title')}
        description={t('enrollment.courseGrid.description')}
      />
      <EnrollmentCoursesGrid />
    </div>
  )
}

export default EnrollmentsListPage

