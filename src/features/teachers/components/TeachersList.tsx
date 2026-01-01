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
import { useTeachers, useDeleteTeacher } from '../hooks/useTeachers'
import { DeleteTeacherDialog } from './DeleteTeacherDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { PAGINATION, TEACHER_STATUS_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '@/constants'
import format from 'date-fns/format'
import type { TeacherCollectionItem } from '../types/teacher.types'
import { useTranslation } from '@/i18n/context'

/**
 * TeachersList component - displays teachers in a table with CRUD actions
 */
export function TeachersList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherCollectionItem | null>(null)

  const { data, isLoading, error } = useTeachers({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    employment_type: employmentTypeFilter !== 'all' ? employmentTypeFilter : undefined,
    search: search || undefined,
  })

  const deleteTeacher = useDeleteTeacher()

  const handleDeleteClick = (teacher: TeacherCollectionItem) => {
    setSelectedTeacher(teacher)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedTeacher) {
      deleteTeacher.mutate(selectedTeacher.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedTeacher(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setDepartmentFilter('all')
    setEmploymentTypeFilter('all')
    setPage(1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'suspended':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const getEmploymentTypeLabel = (type: string) => {
    return t(`teacher.employmentType.${type}`) || type
  }

  const teachers = data?.data || []
  const pagination = data?.meta?.pagination

  // Get unique departments for filter
  const departments = Array.from(
    new Set(teachers.map((teacher) => teacher.department).filter(Boolean))
  ) as string[]

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
              placeholder={t('teacher.filters.searchTeachers')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('teacher.filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('teacher.filters.allStatus')}</SelectItem>
              {TEACHER_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {getStatusLabel(status.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {departments.length > 0 && (
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('teacher.filters.filterByDepartment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('teacher.filters.allDepartments')}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('teacher.filters.filterByEmploymentType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('teacher.filters.allEmploymentTypes')}</SelectItem>
              {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {getEmploymentTypeLabel(type.value)}
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
            {t('teacher.actions.clear')}
          </Button>
        </div>

        {/* Teachers Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
              {isLoading && (
                <TableSkeleton
                  columns={[
                    { width: 'w-8', className: 'w-16' },
                    { width: 'w-20' },
                    { 
                      width: 'w-32',
                      customCell: () => (
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      )
                    },
                    { width: 'w-40' },
                    { width: 'w-32' },
                    { width: 'w-24' },
                    { width: 'w-28' },
                    { width: 'w-16' },
                    { width: 'w-24', className: 'hidden lg:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoading && teachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search || statusFilter !== 'all' || departmentFilter !== 'all' || employmentTypeFilter !== 'all'
                      ? t('teacher.messages.noTeachersFound')
                      : t('teacher.messages.noTeachers')}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('teacher.table.no')}</TableHead>
                        <TableHead>{t('teacher.table.teacherId')}</TableHead>
                        <TableHead>{t('teacher.table.name')}</TableHead>
                        <TableHead>{t('teacher.table.email')}</TableHead>
                        <TableHead>{t('teacher.table.department')}</TableHead>
                        <TableHead>{t('teacher.table.subject')}</TableHead>
                        <TableHead>{t('teacher.table.employmentType')}</TableHead>
                        <TableHead>{t('teacher.table.status')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('teacher.table.created')}</TableHead>
                        <TableHead className="text-right">{t('teacher.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={teacher.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {teacher.teacher_id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{teacher.user.name}</div>
                                {teacher.user.phone && (
                                  <div className="text-sm text-muted-foreground">
                                    {teacher.user.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{teacher.user.email}</TableCell>
                            <TableCell>{teacher.department || '-'}</TableCell>
                            <TableCell>{teacher.subject || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getEmploymentTypeLabel(teacher.employment_type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(teacher.status)}>
                                {getStatusLabel(teacher.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {teacher.created_at
                                ? format(new Date(teacher.created_at), 'MMM dd, yyyy')
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
                                    <Link to={`/teachers/${teacher.id}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('teacher.actions.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/teachers/${teacher.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('teacher.actions.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(teacher)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('teacher.actions.delete')}
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
              itemName={t('teacher.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteTeacherDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        teacherName={selectedTeacher?.user.name || ''}
        isLoading={deleteTeacher.isPending}
      />
    </>
  )
}

