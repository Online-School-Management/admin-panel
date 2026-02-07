import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, BookOpen, Users, UserPlus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/common/Pagination'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { COURSE_STATUS, PAGINATION } from '@/constants'
import format from 'date-fns/format'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: COURSE_STATUS.UPCOMING, labelKey: 'common.status.upcoming' },
  { value: COURSE_STATUS.IN_PROGRESS, labelKey: 'common.status.in_progress' },
  { value: COURSE_STATUS.COMPLETED, labelKey: 'common.status.completed' },
] as const

/**
 * EnrollmentCoursesGrid - displays courses in a grid with status filter (like student payment month filter) and pagination.
 * Default active filter is "Upcoming". Clicking a course navigates to its enrollment management page.
 */
export function EnrollmentCoursesGrid() {
  const { t } = useTranslation()
  const [activeStatus, setActiveStatus] = useState<string>(COURSE_STATUS.UPCOMING)
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = 12 // 4 columns × 3 rows feels right for a grid

  // Fetch courses with server-side status filter and pagination
  const { data: coursesData, isLoading, error } = useCourses({
    status: activeStatus,
    page,
    per_page: perPage,
  })

  const courses = coursesData?.data || []
  const pagination = coursesData?.meta?.pagination

  const handleStatusChange = (status: string) => {
    setActiveStatus(status)
    setPage(1) // Reset to first page when switching status
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'secondary'
      case 'in_progress':
        return 'default'
      case 'completed':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case 'one_on_one':
        return 'One-on-One'
      case 'private':
        return 'Private'
      case 'group':
        return 'Group'
      case 'teacher_training':
        return 'Teacher Training'
      default:
        return type
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('common.messages.somethingWentWrong')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Skeleton grid for loading state
  const skeletonGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Status filter - sticky row of buttons (like student payment month filter) */}
      <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 lg:-mx-6 xl:-mx-8 px-4 lg:px-6 xl:px-8 pt-4">
        <div className="w-full">
          <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
            <div className="inline-flex w-auto gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap">
              {STATUS_OPTIONS.map((option) => {
                const isActive = option.value === activeStatus
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(option.value)}
                    className={cn(
                      'whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all',
                      isActive && 'bg-primary-active text-primary shadow-sm font-semibold'
                    )}
                  >
                    {t(option.labelKey)}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && skeletonGrid}

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('enrollment.courseGrid.noCourses')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course grid */}
      {!isLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/enrollments/course/${course.id}`}
              className="block group"
            >
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:border-primary/50">
                <CardContent className="pt-6 space-y-3">
                  {/* Course title */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </div>

                  {/* Subject */}
                  <p className="text-xs text-muted-foreground">{course.subject.name}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={getStatusBadgeVariant(course.status)} className="text-xs">
                      {getStatusLabel(course.status)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getCourseTypeLabel(course.course_type)}
                    </Badge>
                  </div>

                  {/* Start date */}
                  {course.start_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {t('enrollment.courseGrid.startDate')}{' '}
                        {format(new Date(course.start_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  {/* Teacher */}
                  {course.assigned_teacher && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="truncate">{course.assigned_teacher.name}</span>
                    </div>
                  )}

                  {/* Enrollment count */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{course.enrollments_count} {t('enrollment.courseGrid.students')}</span>
                  </div>

                  {/* Fee */}
                  {course.monthly_fee && (
                    <p className="text-xs font-medium text-primary">
                      {Number(course.monthly_fee).toLocaleString()} / month
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          itemName={t('enrollment.courseGrid.courses')}
        />
      )}
    </div>
  )
}
