import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw } from 'lucide-react'
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
import { useCourses, useDeleteCourse } from '../hooks/useCourses'
import { useSubjects } from '@/features/subjects/hooks/useSubjects'
import { DeleteCourseDialog } from './DeleteCourseDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION, COURSE_STATUS_OPTIONS } from '@/constants'
import type { CourseCollectionItem } from '../types/course.types'
import { useTranslation } from '@/i18n/context'

/**
 * CoursesList component - displays courses in a table with CRUD actions
 */
export function CoursesList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseCollectionItem | null>(null)

  // Fetch subjects for filter dropdown
  const { data: subjectsData } = useSubjects({ per_page: 0 })

  const { data, isLoading, error } = useCourses({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    subject_id: subjectFilter !== 'all' ? Number(subjectFilter) : undefined,
    search: search || undefined,
  })

  const deleteCourse = useDeleteCourse()

  const handleDeleteClick = (course: CourseCollectionItem) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedCourse) {
      deleteCourse.mutate(selectedCourse.slug, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedCourse(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setSubjectFilter('all')
    setPage(1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'upcoming':
        return 'secondary'
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const courses = data?.data || []
  const pagination = data?.meta?.pagination
  const subjects = subjectsData?.data || []

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
              placeholder={t('course.filters.searchCourses')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('course.filters.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('course.filters.allStatuses')}</SelectItem>
              {COURSE_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {t(`common.status.${status.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={subjectFilter}
            onValueChange={(value) => {
              setSubjectFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('course.filters.subject')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('course.filters.allSubjects')}</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={String(subject.id)}>
                  {subject.name}
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
            {t('course.actions.clear')}
          </Button>
        </div>

        {/* Courses Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
              {isLoading && (
                <TableSkeleton
                  columns={[
                    { width: 'w-8', className: 'w-16' },
                    { width: 'w-40' },
                    { width: 'w-40' },
                    { width: 'w-32', className: 'hidden md:table-cell' },
                    { width: 'w-32', className: 'hidden lg:table-cell' },
                    { width: 'w-32', className: 'hidden lg:table-cell' },
                    { width: 'w-24', className: 'hidden xl:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoading && courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search
                      ? t('course.messages.noCoursesFound')
                      : t('course.messages.noCourses')}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('course.table.no')}</TableHead>
                        <TableHead>{t('course.table.title')}</TableHead>
                        <TableHead>{t('course.table.subject')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('course.table.duration')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('course.table.monthlyFee')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('course.table.totalFee')}</TableHead>
                        <TableHead className="hidden xl:table-cell">{t('course.table.status')}</TableHead>
                        <TableHead className="text-right">{t('course.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={course.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{course.subject.name}</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {course.duration_months} {t('course.table.months')}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {course.monthly_fee
                                ? `$${course.monthly_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : '-'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {course.total_fee
                                ? `$${course.total_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : '-'}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <Badge variant={getStatusBadgeVariant(course.status)}>
                                {t(`common.status.${course.status}`)}
                              </Badge>
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
                                    <Link to={`/courses/${course.slug}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('course.actions.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/courses/${course.slug}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('course.actions.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(course)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('course.actions.delete')}
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
              itemName={t('course.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        courseTitle={selectedCourse?.title || ''}
        isLoading={deleteCourse.isPending}
      />
    </>
  )
}

