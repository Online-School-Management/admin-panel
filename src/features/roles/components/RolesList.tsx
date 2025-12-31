import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserCog, ChevronRight, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { useRoles } from '../hooks/useRoles'
import { format } from 'date-fns'
import type { Role } from '../types/role.types'

/**
 * RolesList component - displays roles in a table (read-only)
 */
export function RolesList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const perPage = 15

  const { data, isLoading, error } = useRoles({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  // Filter roles by search term
  const roles = data?.data || []
  const filteredRoles = roles.filter((role) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      role.name.toLowerCase().includes(searchLower) ||
      role.slug.toLowerCase().includes(searchLower) ||
      (role.description &&
        role.description.toLowerCase().includes(searchLower))
    )
  })

  const getStatusBadgeVariant = (status: Role['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('all')
    setPage(1)
  }

  const pagination = data?.meta?.pagination

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading roles: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search roles..."
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
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Roles Table */}
      <div className="space-y-4">
        <div className="rounded-md border relative min-h-[400px]">
            {isLoading && (
              <TableSkeleton
                columns={[
                  { width: 'w-12' },
                  { width: 'w-32' },
                  { width: 'w-24' },
                  { width: 'w-40' },
                  { width: 'w-16' },
                  { width: 'w-20' },
                  { width: 'w-24' },
                  { width: 'w-8', className: 'w-[100px]' },
                ]}
                rows={5}
              />
            )}
            {!isLoading && filteredRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'all'
                    ? 'No roles found matching your criteria.'
                    : 'No roles available.'}
                </p>
              </div>
            ) : (
              <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          {role.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {role.name}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {role.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {role.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(role.status)}>
                            {role.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {role.permissions_count || 0} permissions
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {role.created_at
                            ? format(new Date(role.created_at), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Link to={`/roles/${role.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
              itemName="roles"
            />
          )}

          {/* Results count */}
          {!isLoading && filteredRoles.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredRoles.length} role
              {filteredRoles.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
  )
}

