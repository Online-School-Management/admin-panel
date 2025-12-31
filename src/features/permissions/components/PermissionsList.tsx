import { useState } from 'react'
import { Search, Shield, RefreshCw } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { usePermissions } from '../hooks/usePermissions'
import { format } from 'date-fns'

/**
 * PermissionsList component - displays permissions in a table (read-only)
 */
export function PermissionsList() {
  const [search, setSearch] = useState('')

  // Fetch all permissions
  const {
    data: permissionsData,
    isLoading,
    error,
  } = usePermissions()

  // Filter permissions by search term
  const permissions = permissionsData?.data || []
  const filteredPermissions = permissions.filter((permission) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      permission.name.toLowerCase().includes(searchLower) ||
      permission.slug.toLowerCase().includes(searchLower) ||
      permission.module.toLowerCase().includes(searchLower) ||
      (permission.description &&
        permission.description.toLowerCase().includes(searchLower))
    )
  })

  const getModuleBadgeVariant = (module: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      users: 'default',
      admins: 'destructive',
      roles: 'secondary',
      permissions: 'outline',
    }
    return variants[module] || 'secondary'
  }

  const handleReset = () => {
    setSearch('')
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading permissions: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Permissions Table */}
      <div className="space-y-4">
        <div className="rounded-md border relative min-h-[400px]">
            {isLoading && (
              <TableSkeleton
                columns={[
                  { width: 'w-12' },
                  { width: 'w-32' },
                  { width: 'w-24' },
                  { width: 'w-16' },
                  { width: 'w-40' },
                  { width: 'w-24' },
                ]}
                rows={5}
              />
            )}
            {!isLoading && filteredPermissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {search
                    ? 'No permissions found matching your criteria.'
                    : 'No permissions available.'}
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
                      <TableHead>Module</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {permission.id}
                      </TableCell>
                      <TableCell>{permission.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {permission.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getModuleBadgeVariant(permission.module)}>
                          {permission.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {permission.description || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {permission.created_at
                          ? format(new Date(permission.created_at), 'MMM dd, yyyy')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </div>

          {/* Results count */}
          {!isLoading && filteredPermissions.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredPermissions.length} permission
              {filteredPermissions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
  )
}

