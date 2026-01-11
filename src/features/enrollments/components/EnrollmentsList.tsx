import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEnrollments, useDeleteEnrollment } from '../hooks/useEnrollments'
import { useStudents } from '@/features/students/hooks/useStudents'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { DeleteEnrollmentDialog } from './DeleteEnrollmentDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION } from '@/constants'
import type { EnrollmentCollectionItem } from '../types/enrollment.types'
import { useTranslation } from '@/i18n/context'

/**
 * EnrollmentsList component - displays enrollments in a table with CRUD actions
 */
export function EnrollmentsList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [studentFilter, setStudentFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentCollectionItem | null>(null)

  // Fetch students and courses for filter dropdowns
  const { data: studentsData } = useStudents({ per_page: 100 })
  const { data: coursesData } = useCourses({ per_page: 100 })

  const { data, isLoading, error } = useEnrollments({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    student_id: studentFilter !== 'all' ? Number(studentFilter) : undefined,
    course_id: courseFilter !== 'all' ? Number(courseFilter) : undefined,
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
    setStudentFilter('all')
    setCourseFilter('all')
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

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const enrollments = data?.data || []
  const pagination = data?.meta?.pagination

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

  return (
    <>
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
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('enrollment.filters.filterByStudent')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('enrollment.filters.allStudents')}</SelectItem>
              {studentsData?.data.map((student) => (
                <SelectItem key={student.id} value={String(student.id)}>
                  {student.user.name} ({student.student_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('enrollment.filters.filterByCourse')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('enrollment.filters.allCourses')}</SelectItem>
              {coursesData?.data.map((course) => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.title}
                </SelectItem>
              ))}
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

        {/* Enrollments Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
            {isLoading && (
              <TableSkeleton
                columns={[
                  { width: 'w-8', className: 'w-16' },
                  { width: 'w-32' },
                  { width: 'w-40' },
                  { width: 'w-40' },
                  { width: 'w-32' },
                  { width: 'w-24' },
                  { width: 'w-24', className: 'hidden lg:table-cell' },
                  { width: 'w-8', className: 'text-right' },
                ]}
                rows={5}
              />
            )}
            {!isLoading && enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'all' || studentFilter !== 'all' || courseFilter !== 'all'
                    ? t('enrollment.messages.noEnrollmentsFound')
                    : t('enrollment.messages.noEnrollments')}
                </p>
              </div>
            ) : (
              <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">{t('enrollment.table.no')}</TableHead>
                      <TableHead>{t('enrollment.table.student')}</TableHead>
                      <TableHead>{t('enrollment.table.course')}</TableHead>
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
                            <div>
                              <div className="font-medium">{enrollment.course.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {enrollment.course.subject.name}
                              </div>
                            </div>
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
          {!isLoading && pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              itemName={t('enrollment.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteEnrollmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        enrollmentInfo={
          selectedEnrollment
            ? `${selectedEnrollment.student.name} - ${selectedEnrollment.course.title}`
            : ''
        }
        isLoading={deleteEnrollment.isPending}
      />
    </>
  )
}

