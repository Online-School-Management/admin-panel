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
import { useAdmins, useDeleteAdmin } from '../hooks/useAdmins'
import { DeleteAdminDialog } from './DeleteAdminDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { PAGINATION, ADMIN_STATUS_OPTIONS } from '@/constants'
import { format } from 'date-fns'
import type { AdminCollectionItem } from '../types/admin.types'
import { useTranslation } from '@/i18n/context'

/**
 * AdminsList component - displays admins in a table with CRUD actions
 */
export function AdminsList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminCollectionItem | null>(null)

  const { data, isLoading, error } = useAdmins({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    search: search || undefined,
  })

  const deleteAdmin = useDeleteAdmin()

  const handleDeleteClick = (admin: AdminCollectionItem) => {
    setSelectedAdmin(admin)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedAdmin) {
      deleteAdmin.mutate(selectedAdmin.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedAdmin(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setDepartmentFilter('all')
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


  const admins = data?.data || []
  const pagination = data?.meta?.pagination

  // Get unique departments for filter
  const departments = Array.from(
    new Set(admins.map((admin) => admin.department).filter(Boolean))
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
              placeholder={t('admin.filters.searchAdmins')}
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
              <SelectValue placeholder={t('admin.filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.filters.allStatus')}</SelectItem>
              {ADMIN_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {getStatusLabel(status.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {departments.length > 0 && (
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('admin.filters.filterByDepartment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.filters.allDepartments')}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('admin.actions.clear')}
          </Button>
        </div>

        {/* Admins Table */}
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
                    { width: 'w-24' },
                    { width: 'w-16' },
                    { width: 'w-20' },
                    { width: 'w-24', className: 'hidden lg:table-cell' },
                    { width: 'w-8', className: 'text-right' },
                  ]}
                  rows={5}
                />
              )}
              {!isLoading && admins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search || statusFilter !== 'all' || departmentFilter !== 'all'
                      ? t('admin.messages.noAdminsFound')
                      : t('admin.messages.noAdmins')}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">{t('admin.table.no')}</TableHead>
                        <TableHead>{t('admin.table.adminId')}</TableHead>
                        <TableHead>{t('admin.table.name')}</TableHead>
                        <TableHead>{t('admin.table.email')}</TableHead>
                        <TableHead>{t('admin.table.department')}</TableHead>
                        <TableHead>{t('admin.table.status')}</TableHead>
                        <TableHead>{t('admin.table.roles')}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t('admin.table.created')}</TableHead>
                        <TableHead className="text-right">{t('admin.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin, index) => {
                        // Calculate row number based on pagination
                        const rowNumber = pagination
                          ? (pagination.current_page - 1) * pagination.per_page + index + 1
                          : index + 1
                        
                        return (
                          <TableRow key={admin.id}>
                            <TableCell className="text-muted-foreground text-center">
                              {rowNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {admin.admin_id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{admin.user.name}</div>
                                {admin.user.phone && (
                                  <div className="text-sm text-muted-foreground">
                                    {admin.user.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{admin.user.email}</TableCell>
                            <TableCell>{admin.department || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(admin.status)}>
                                {getStatusLabel(admin.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {admin.roles && admin.roles.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {admin.roles.slice(0, 2).map((role) => (
                                    <Badge key={role.id} variant="outline" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ))}
                                  {admin.roles.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{admin.roles.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">{t('admin.messages.noRoles')}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                              {admin.created_at
                                ? format(new Date(admin.created_at), 'MMM dd, yyyy')
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
                                    <Link to={`/admins/${admin.id}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      {t('admin.actions.view')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admins/${admin.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {t('admin.actions.edit')}
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(admin)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('admin.actions.delete')}
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
              itemName={t('admin.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteAdminDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        adminName={selectedAdmin?.user.name || ''}
        isLoading={deleteAdmin.isPending}
      />
    </>
  )
}

