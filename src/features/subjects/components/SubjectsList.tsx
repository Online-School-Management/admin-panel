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
import { Card, CardContent } from '@/components/ui/card'
import { useSubjects, useDeleteSubject } from '../hooks/useSubjects'
import { DeleteSubjectDialog } from './DeleteSubjectDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION } from '@/constants'
import format from 'date-fns/format'
import type { SubjectCollectionItem } from '../types/subject.types'
import { useTranslation } from '@/i18n/context'

/**
 * SubjectsList component - displays subjects in a table with CRUD actions
 */
export function SubjectsList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<SubjectCollectionItem | null>(null)

  const { data, isLoading, error } = useSubjects({
    page,
    per_page: perPage,
    search: search || undefined,
  })

  const deleteSubject = useDeleteSubject()

  const handleDeleteClick = (subject: SubjectCollectionItem) => {
    setSelectedSubject(subject)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedSubject) {
      deleteSubject.mutate(selectedSubject.slug, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedSubject(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setPage(1)
  }

  const subjects = data?.data || []
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
              placeholder={t('subject.filters.searchSubjects')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('subject.actions.clear')}
          </Button>
        </div>

        {/* Subjects Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
              {isLoading && (
                <TableSkeleton
                  columns={[
                    { width: 'w-8', className: 'w-16' },
                    { width: 'w-40' },
                    { width: 'w-40' },
                    { width: 'w-64', className: 'hidden md:table-cell' },
                    { width: 'w-24', className: 'hidden lg:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoading && subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search
                      ? t('subject.messages.noSubjectsFound')
                      : t('subject.messages.noSubjects')}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('subject.table.no')}</TableHead>
                        <TableHead>{t('subject.table.name')}</TableHead>
                        <TableHead>{t('subject.table.slug')}</TableHead>
                        <TableHead className="hidden md:table-cell">{t('subject.table.description')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('subject.table.created')}</TableHead>
                        <TableHead className="text-right">{t('subject.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={subject.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {subject.name}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {subject.slug}
                              </code>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {subject.description ? (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {subject.description}
                                </p>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {subject.created_at
                                ? format(new Date(subject.created_at), 'MMM dd, yyyy')
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
                                    <Link to={`/subjects/${subject.slug}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('subject.actions.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/subjects/${subject.slug}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('subject.actions.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(subject)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('subject.actions.delete')}
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
              itemName={t('subject.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        subjectName={selectedSubject?.name || ''}
        isLoading={deleteSubject.isPending}
      />
    </>
  )
}

