import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, UserCog, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useRole } from '../hooks/useRoles'

/**
 * RoleDetail component - displays detailed role information (read-only)
 */
export function RoleDetail() {
  const { id } = useParams<{ id: string }>()
  const roleId = id ? parseInt(id, 10) : 0

  const { data, isLoading, error } = useRole(roleId)

  const role = data?.data
  const permissions = role?.permissions || []

  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Back Button Skeleton */}
        <Skeleton className="h-10 w-32" />

        {/* Role Information Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Skeleton */}
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="mb-3 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="h-px w-full bg-muted" />
                  </div>
                  <div className="rounded-md border">
                    <div className="p-4 space-y-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex gap-4">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-40 flex-1" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-48 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !role) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-destructive mb-4">
              {(error as Error)?.message || 'Role not found'}
            </p>
            <Button asChild variant="outline">
              <Link to="/roles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roles
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group permissions by module
  const permissionsByModule = permissions.reduce(
    (acc, permission) => {
      const module = permission.module || 'other'
      if (!acc[module]) {
        acc[module] = []
      }
      acc[module].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>
  )

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/roles">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Link>
      </Button>

      {/* Role Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{role.name}</CardTitle>
              <CardDescription className="mt-2">
                {role.description || 'No description provided'}
              </CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(role.status)}>
              {role.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">
                  {role.slug}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Permissions Count
                </p>
                <p className="text-lg font-semibold mt-1">
                  {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions
          </CardTitle>
          <CardDescription>
            All permissions assigned to this role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {permissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No permissions assigned to this role
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                <div key={module}>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold capitalize mb-2">
                      {module} Module
                    </h3>
                    <Separator />
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        {modulePermissions.map((permission) => (
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
                            <TableCell className="text-muted-foreground">
                              {permission.description || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

