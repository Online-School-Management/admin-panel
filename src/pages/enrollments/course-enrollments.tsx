import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw, UserPlus, BookOpen, Calendar, Users } from 'lucide-react'
import format from 'date-fns/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { DeleteEnrollmentDialog } from '@/features/enrollments/components/DeleteEnrollmentDialog'
import { useEnrollments, useDeleteEnrollment } from '@/features/enrollments/hooks/useEnrollments'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { PAGINATION } from '@/constants'
import type { EnrollmentCollectionItem } from '@/features/enrollments/types/enrollment.types'
import { useTranslation } from '@/i18n/context'

/**
 * Course Enrollments Page
 * Shows course info summary at top, then enrollment list filtered by this course.
 * Admin can add a new enrollment (pre-filled with this course).
 */
function CourseEnrollmentsPage() {
  const { t } = useTranslation()
  const { courseId } = useParams<{ courseId: string }>()
  const courseIdNum = Number(courseId)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentCollectionItem | null>(null)

  // Fetch course data to display summary
  const { data: coursesData, isLoading: isLoadingCourse } = useCourses({ per_page: 100 })
  const course = coursesData?.data.find((c) => c.id === courseIdNum)

  // Fetch enrollments filtered by this course
  const { data: enrollmentsData, isLoading: isLoadingEnrollments, error } = useEnrollments({
    page,
    per_page: perPage,
    course_id: courseIdNum,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  })

  const deleteEnrollment = useDeleteEnrollment()

  const handleDeleteClick = (enrollment: EnrollmentCollectionItem) => {
    setSelectedEnrollment(enrollment)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedEnrollment) {
      deleteEnrollment.mutate(selectedEnrollment.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedEnrollment(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'dropped':
        return 'destructive'
      case 'completed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getCourseStatusBadgeVariant = (status: string) => {
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

  const enrollments = enrollmentsData?.data || []
  const pagination = enrollmentsData?.meta?.pagination

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('enrollment.courseEnrollments.title')}
        description={t('enrollment.courseEnrollments.description')}
        backTo="/enrollments"
        backLabel={t('enrollment.courseEnrollments.backToCourses')}
        action={
          <Button asChild>
            <Link to="/enrollments/new" state={{ courseId: courseIdNum }}>
              <UserPlus className="h-4 w-4 mr-2" />
              {t('enrollment.courseEnrollments.addEnrollment')}
            </Link>
          </Button>
        }
      />

      {/* Course Info Summary Card */}
      {isLoadingCourse ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : course ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <Badge variant={getCourseStatusBadgeVariant(course.status)}>
                {getStatusLabel(course.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{t('enrollment.detail.subject')}</p>
                  <p className="font-medium">{course.subject.name}</p>
                </div>
              </div>
              {course.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">{t('enrollment.courseGrid.startDate')}</p>
                    <p className="font-medium">{format(new Date(course.start_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              )}
              {course.assigned_teacher && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Teacher</p>
                    <p className="font-medium">{course.assigned_teacher.name}</p>
                  </div>
                </div>
              )}
              {course.monthly_fee && (
                <div>
                  <p className="text-muted-foreground text-xs">Monthly Fee</p>
                  <p className="font-medium text-primary">{Number(course.monthly_fee).toLocaleString()} / month</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Enrollments Section */}
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('enrollment.filters.searchEnrollments')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('enrollment.filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('enrollment.filters.allStatus')}</SelectItem>
              <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
              <SelectItem value="dropped">{getStatusLabel('dropped')}</SelectItem>
              <SelectItem value="completed">{getStatusLabel('completed')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('enrollment.actions.clear')}
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">
                {t('common.messages.somethingWentWrong')}: {(error as Error).message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Enrollments Table */}
        {!error && (
          <div className="space-y-4">
            <div className="rounded-md border relative min-h-[300px]">
              {isLoadingEnrollments && (
                <TableSkeleton
                  columns={[
                    { width: 'w-8', className: 'w-16' },
                    { width: 'w-32' },
                    { width: 'w-32' },
                    { width: 'w-24' },
                    { width: 'w-24', className: 'hidden lg:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoadingEnrollments && enrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserPlus className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    {search || statusFilter !== 'all'
                      ? t('enrollment.messages.noEnrollmentsFound')
                      : t('enrollment.courseEnrollments.noEnrollments')}
                  </p>
                  {!search && statusFilter === 'all' && (
                    <Button asChild variant="outline" className="mt-4">
                      <Link to="/enrollments/new" state={{ courseId: courseIdNum }}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t('enrollment.courseEnrollments.addEnrollment')}
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className={isLoadingEnrollments ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('enrollment.table.no')}</TableHead>
                        <TableHead>{t('enrollment.table.student')}</TableHead>
                        <TableHead>{t('enrollment.table.enrolledAt')}</TableHead>
                        <TableHead>{t('enrollment.table.status')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('enrollment.table.created')}</TableHead>
                        <TableHead className="text-right">{t('enrollment.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment, index) => {
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1

                        return (
                          <TableRow key={enrollment.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell>
                              {enrollment.student ? (
                                <div>
                                  <div className="font-medium">{enrollment.student.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {enrollment.student.student_id}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">Student deleted</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {enrollment.enrolled_at
                                ? format(new Date(enrollment.enrolled_at), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                                {getStatusLabel(enrollment.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {enrollment.created_at
                                ? format(new Date(enrollment.created_at), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-10 w-10">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/enrollments/${enrollment.id}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('enrollment.actions.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/enrollments/${enrollment.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('enrollment.actions.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(enrollment)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('enrollment.actions.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            {/* Pagination */}
            {!isLoadingEnrollments && pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={setPage}
                itemName={t('enrollment.pages.list').toLowerCase()}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteEnrollmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        enrollmentInfo={
          selectedEnrollment
            ? `${selectedEnrollment.student?.name || 'Unknown'} - ${selectedEnrollment.course.title}`
            : ''
        }
        isLoading={deleteEnrollment.isPending}
      />
    </div>
  )
}

export default CourseEnrollmentsPage
