import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw, RotateCcw, XCircle } from 'lucide-react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useStudents, useDeleteStudent, useRestoreStudent, useForceDeleteStudent } from '../hooks/useStudents'
import { DeleteStudentDialog } from './DeleteStudentDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { PAGINATION } from '@/constants'
import format from 'date-fns/format'
import type { StudentCollectionItem } from '../types/student.types'
import { useTranslation } from '@/i18n/context'
import { cn } from '@/lib/utils'

/**
 * StudentsList component - displays students in a table with CRUD actions
 */
export function StudentsList() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'active' | 'trashed'>('active')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentCollectionItem | null>(null)

  const { data, isLoading, error } = useStudents({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
    trashed: activeTab === 'trashed',
  })

  const deleteStudent = useDeleteStudent()
  const restoreStudent = useRestoreStudent()
  const forceDeleteStudent = useForceDeleteStudent()

  const handleDeleteClick = (student: StudentCollectionItem) => {
    setSelectedStudent(student)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedStudent) {
      deleteStudent.mutate(selectedStudent.slug, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedStudent(null)
        },
      })
    }
  }

  const handleRestoreClick = (student: StudentCollectionItem) => {
    setSelectedStudent(student)
    setRestoreDialogOpen(true)
  }

  const handleRestoreConfirm = () => {
    if (selectedStudent) {
      restoreStudent.mutate(selectedStudent.slug, {
        onSuccess: () => {
          setRestoreDialogOpen(false)
          setSelectedStudent(null)
          // Switch to active tab after restore
          setActiveTab('active')
        },
      })
    }
  }

  const handleForceDeleteClick = (student: StudentCollectionItem) => {
    setSelectedStudent(student)
    setForceDeleteDialogOpen(true)
  }

  const handleForceDeleteConfirm = () => {
    if (selectedStudent) {
      forceDeleteStudent.mutate(selectedStudent.slug, {
        onSuccess: () => {
          setForceDeleteDialogOpen(false)
          setSelectedStudent(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'active' | 'trashed')
    setPage(1) // Reset to first page when switching tabs
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  const students = data?.data || []
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
        {/* Tab Buttons - Sticky */}
        <div className="sticky top-[64px] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 lg:-mx-6 xl:-mx-8 px-4 lg:px-6 xl:px-8 pt-4">
          <div className="w-full">
            <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
              <div className="inline-flex w-auto gap-2 min-w-full sm:min-w-0 flex-wrap sm:flex-nowrap">
                <Button
                  variant={activeTab === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('active')}
                  className={cn(
                    "whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all",
                    activeTab === 'active' && "bg-primary-active text-primary shadow-sm font-semibold"
                  )}
                >
                  {t('student.tabs.active') || 'Active Students'}
                </Button>
                <Button
                  variant={activeTab === 'trashed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('trashed')}
                  className={cn(
                    "whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base flex-shrink-0 min-w-fit transition-all",
                    activeTab === 'trashed' && "bg-primary-active text-primary shadow-sm font-semibold"
                  )}
                >
                  {t('student.tabs.trashed') || 'Deleted Students'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('student.filters.searchStudents')}
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
              <SelectValue placeholder={t('student.filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('student.filters.allStatus')}</SelectItem>
              <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
              <SelectItem value="inactive">{getStatusLabel('inactive')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('student.actions.clear')}
          </Button>
        </div>

        {/* Students Table */}
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
                    { width: 'w-16' },
                    { width: 'w-24', className: 'hidden lg:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoading && students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search || statusFilter !== 'all'
                      ? t('student.messages.noStudentsFound')
                      : t('student.messages.noStudents')}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('student.table.no')}</TableHead>
                        <TableHead>{t('student.table.studentId')}</TableHead>
                        <TableHead>{t('student.table.name')}</TableHead>
                        <TableHead>{t('student.table.email')}</TableHead>
                        <TableHead>{t('student.table.guardianPhone')}</TableHead>
                        <TableHead>{t('student.table.age')}</TableHead>
                        <TableHead>{t('student.table.status')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('student.table.created')}</TableHead>
                        <TableHead className="text-right">{t('student.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.student_id}
                            </TableCell>
                            <TableCell>
                              {student.user ? (
                                <div>
                                  <div className="font-medium">{student.user.name}</div>
                                  {student.user.phone && (
                                    <div className="text-sm text-muted-foreground">
                                      {student.user.phone}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">User deleted</span>
                              )}
                            </TableCell>
                            <TableCell>{student.user?.email || '-'}</TableCell>
                            <TableCell>{student.guardian_phone || '-'}</TableCell>
                            <TableCell>{student.age || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(student.status)}>
                                {getStatusLabel(student.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {student.created_at
                                ? format(new Date(student.created_at), 'MMM dd, yyyy')
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {activeTab === 'trashed' ? (
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleRestoreClick(student)}
                                    disabled={restoreStudent.isPending || forceDeleteStudent.isPending}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    {t('student.actions.restore') || 'Restore'}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleForceDeleteClick(student)}
                                    disabled={restoreStudent.isPending || forceDeleteStudent.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {t('student.actions.forceDelete') || 'Permanent Delete'}
                                  </Button>
                                </div>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/students/${student.slug}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        {t('student.actions.view')}
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link to={`/students/${student.slug}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {t('student.actions.edit')}
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(student)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {t('student.actions.delete')}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
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
              itemName={t('student.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteStudentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        studentName={selectedStudent?.user.name || ''}
        isLoading={deleteStudent.isPending}
      />

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('student.dialogs.restoreTitle') || 'Restore Student'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('student.dialogs.restoreMessage', { name: selectedStudent?.user?.name || selectedStudent?.student_id }) ||
                `Are you sure you want to restore "${selectedStudent?.user?.name || selectedStudent?.student_id}"? This will restore the student and their user account.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoreStudent.isPending}>
              {t('common.actions.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={restoreStudent.isPending}
            >
              {restoreStudent.isPending
                ? t('student.messages.restoring') || 'Restoring...'
                : t('student.actions.restore') || 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Force Delete Dialog */}
      <AlertDialog open={forceDeleteDialogOpen} onOpenChange={setForceDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('student.dialogs.forceDeleteTitle') || 'Permanently Delete Student'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('student.dialogs.forceDeleteMessage', { name: selectedStudent?.user?.name || selectedStudent?.student_id }) ||
                `Are you sure you want to permanently delete "${selectedStudent?.user?.name || selectedStudent?.student_id}"? This action cannot be undone and will permanently remove the student, their user account, and all related data (enrollments, payments, etc.).`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={forceDeleteStudent.isPending}>
              {t('common.actions.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForceDeleteConfirm}
              disabled={forceDeleteStudent.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {forceDeleteStudent.isPending
                ? t('student.messages.forceDeleting') || 'Deleting...'
                : t('student.actions.forceDelete') || 'Permanent Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}



