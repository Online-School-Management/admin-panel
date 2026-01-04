import { useState } from 'react'
import { Calendar, DollarSign, Clock, BookOpen, UserPlus, User, Mail, Percent, CalendarDays, CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DetailSkeleton } from '@/components/common/skeletons/DetailSkeleton'
import { useCourse } from '../hooks/useCourses'
import { AssignTeacherModal } from '@/features/course-teachers/components/AssignTeacherModal'
import { ScheduleModal } from '@/features/schedules/components/ScheduleModal'
import { ClassSessionsCard } from './ClassSessionsCard'
import format from 'date-fns/format'
import type { Course } from '../types/course.types'
import { useTranslation } from '@/i18n/context'

interface CourseDetailProps {
  courseSlug: string
}

/**
 * CourseDetail component - displays detailed course information
 */
export function CourseDetail({ courseSlug }: CourseDetailProps) {
  const { t } = useTranslation()
  const [assignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const { data: courseData, isLoading, error } = useCourse(courseSlug)

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('course.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!courseData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('course.messages.courseNotFound')}</p>
        </CardContent>
      </Card>
    )
  }

  const course: Course = courseData.data

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'default'
      case 'upcoming':
        return 'warning'
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('course.detail.subject')}
                  </p>
                  <p className="text-base font-semibold">{course.subject.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('course.detail.title')}</p>
                  <p className="text-base font-semibold">{course.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('course.detail.duration')}
                  </p>
                  <p className="text-base">{course.duration_months} {t('course.detail.months')}</p>
                </div>
                {course.monthly_fee && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t('course.detail.monthlyFee')}
                    </p>
                    <p className="text-base">
                      {course.monthly_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kyats
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('course.detail.totalHours')}
                  </p>
                  <p className="text-base">
                    {course.total_hours && course.total_hours > 0
                      ? `${course.total_hours} ${t('course.detail.hours') || 'hours'}`
                      : '0'}
                  </p>
                </div>
                {course.total_fee && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t('course.detail.totalFee')}
                    </p>
                    <p className="text-base">
                      ${course.total_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('course.detail.courseType')}
                  </p>
                  <p className="text-base font-semibold">
                    {course.course_type === 'one_on_one' && 'One-on-One'}
                    {course.course_type === 'private' && 'Private'}
                    {course.course_type === 'group' && 'Group'}
                    {course.course_type === 'teacher_training' && 'Teacher Training'}
                  </p>
                </div>

                {/* Dates Section */}
                {(course.start_date || course.end_date) && (
                  <>
                    {/* <Separator className="my-4" /> */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {t('course.detail.startDate')}
                      </p>
                      {course.start_date && (
                        <p className="text-base">
                            {format(new Date(course.start_date), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class Sessions */}
          <ClassSessionsCard 
            classSessions={course.class_sessions} 
            maxDisplay={28}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Teacher */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('course.detail.assignedTeacher')}</CardTitle>
                {course.assigned_teacher && (
                  <Button
                    onClick={() => setAssignTeacherModalOpen(true)}
                    variant="default"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('course.actions.assignTeacher')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.assigned_teacher ? (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('course.detail.teacherName')}
                    </p>
                    <p className="text-base font-semibold">{course.assigned_teacher.name}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t('course.detail.teacherEmail')}
                    </p>
                    <p className="text-base">{course.assigned_teacher.email}</p>
                  </div>
                  {course.assigned_teacher.commission_rate !== null && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          {t('course.detail.commissionRate')}
                        </p>
                        <p className="text-base">
                          {course.assigned_teacher.commission_rate.toFixed(2)}%
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t('course.detail.noTeacherAssigned')}</p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setAssignTeacherModalOpen(true)}
                      variant="default"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {t('course.actions.assignTeacher')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {t('course.detail.schedules')}
                </CardTitle>
                {course.schedules && course.schedules.length > 0 && course.assigned_teacher && (
                  <Button
                    onClick={() => setScheduleModalOpen(true)}
                    variant="default"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('course.actions.manageSchedule')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {course.schedules && course.schedules.length > 0 ? (
                <div className="space-y-3">
                  {course.schedules.map((schedule) => {
                    const formatTimeTo12Hour = (time24: string): string => {
                      if (!time24) return time24
                      const [hours, minutes] = time24.split(':').map(Number)
                      const period = hours >= 12 ? 'PM' : 'AM'
                      const hours12 = hours % 12 || 12
                      const minutesStr = minutes.toString().padStart(2, '0')
                      return `${hours12}:${minutesStr} ${period}`
                    }

                    return (
                      <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">{schedule.day_of_week}</Badge>
                          <div>
                            <p className="font-medium">
                              {formatTimeTo12Hour(schedule.start_time)} - {formatTimeTo12Hour(schedule.end_time)}
                            </p>
                            {schedule.room_or_link && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {t('schedule.modal.roomOrLink')}: {schedule.room_or_link}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('course.detail.noSchedules')}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setScheduleModalOpen(true)}
                      variant="default"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('course.actions.manageSchedule')}
                    </Button>
                  </div>
                  {!course.assigned_teacher && (
                    <p className="text-xs text-muted-foreground text-center">
                      {t('schedule.modal.assignTeacherFirst')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('course.detail.courseStatus')}</p>
                <Badge variant={getStatusBadgeVariant(course.status)}>
                  {t(`common.status.${course.status}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('course.detail.created')}</p>
                  <p className="text-base text-sm">
                    {format(new Date(course.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {course.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('course.detail.updated')}</p>
                    <p className="text-base text-sm">
                      {format(new Date(course.updated_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Teacher Modal */}
      {courseData?.data && (
        <>
          <AssignTeacherModal
            open={assignTeacherModalOpen}
            onOpenChange={setAssignTeacherModalOpen}
            courseId={courseData.data.id}
            courseTitle={courseData.data.title}
          />
          <ScheduleModal
            open={scheduleModalOpen}
            onOpenChange={setScheduleModalOpen}
            courseId={courseData.data.id}
            courseTitle={courseData.data.title}
            assignedTeacher={courseData.data.assigned_teacher}
          />
        </>
      )}
    </div>
  )
}

