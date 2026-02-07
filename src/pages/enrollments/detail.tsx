import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnrollmentDetail } from '@/features/enrollments/components/EnrollmentDetail'
import { EditEnrollmentModal } from '@/features/enrollments/components/EditEnrollmentModal'
import { PageHeader } from '@/components/common/PageHeader'
import { useTranslation } from '@/i18n/context'

/**
 * Enrollment Detail Page - Displays detailed information about an enrollment
 */
function EnrollmentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const enrollmentId = id ? Number(id) : 0
  const [editModalOpen, setEditModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('enrollment.pages.detail')}
        description={t('enrollment.descriptions.detail')}
        backTo="/enrollments"
        action={
          enrollmentId > 0 ? (
            <Button onClick={() => setEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {t('enrollment.actions.edit')}
            </Button>
          ) : undefined
        }
      />
      {enrollmentId > 0 && <EnrollmentDetail enrollmentId={enrollmentId} />}

      <EditEnrollmentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        enrollmentId={enrollmentId > 0 ? enrollmentId : null}
      />
    </div>
  )
}

export default EnrollmentDetailPage

