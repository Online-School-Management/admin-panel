// import { PageHeader } from '@/components/common/PageHeader'
import { TeacherPayoutsList } from '@/features/teacher-payouts/components'
// import { useTranslation } from '@/i18n/context'

export default function TeacherPayoutsListPage() {
  // const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title={t('teacherPayout.page.title')}
        description={t('teacherPayout.page.description')}
      /> */}
      <TeacherPayoutsList />
    </div>
  )
}
