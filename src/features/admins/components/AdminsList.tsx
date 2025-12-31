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
import { format } from 'date-fns'
import type { AdminCollectionItem } from '../types/admin.types'

/**
 * AdminsList component - displays admins in a table with CRUD actions
 */
export function AdminsList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const perPage = 15
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
            Error loading admins: {(error as Error).message}
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
              placeholder="Search admins..."
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
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {departments.length > 0 && (
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
            Clear
          </Button>
        </div>

        {/* Admins Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
            <div className="rounded-md border relative min-h-[400px]">
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {!isLoading && admins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">
                    {search || statusFilter !== 'all' || departmentFilter !== 'all'
                      ? 'No admins found matching your criteria.'
                      : 'No admins available.'}
                  </p>
                </div>
              ) : (
                <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id}>
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
                              {admin.status}
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
                              <span className="text-muted-foreground text-sm">No roles</span>
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
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/admins/${admin.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(admin)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            {/* Pagination */}
            {!isLoading && pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.from || 0} to {pagination.to || 0} of{' '}
                  {pagination.total} admins
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.last_page, p + 1))
                    }
                    disabled={page === pagination.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            </div>
          </CardContent>
        </Card>
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

