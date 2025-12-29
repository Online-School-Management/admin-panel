import { Link } from 'react-router-dom'
import { ArrowLeft, Edit, Mail, Phone, Calendar, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAdmin, useAdminPermissions } from '../hooks/useAdmins'
import { format } from 'date-fns'
import type { Admin } from '../types/admin.types'

interface AdminDetailProps {
  adminId: string
}

/**
 * AdminDetail component - displays detailed admin information
 */
export function AdminDetail({ adminId }: AdminDetailProps) {
  const { data: adminData, isLoading, error } = useAdmin(parseInt(adminId))
  const { data: permissionsData } = useAdminPermissions(parseInt(adminId))

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Loading admin...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading admin: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!adminData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Admin not found</p>
        </CardContent>
      </Card>
    )
  }

  const admin: Admin = adminData.data
  const permissions = permissionsData?.data || []

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admins">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{admin.user.name}</h1>
            <p className="text-muted-foreground">{admin.user.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/admins/${adminId}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Admin
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Admin ID</p>
                  <p className="text-base font-semibold">{admin.admin_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(admin.status)}>
                    {admin.status}
                  </Badge>
                </div>
                {admin.department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Department
                    </p>
                    <p className="text-base">{admin.department}</p>
                  </div>
                )}
                {admin.hire_date && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Hire Date
                    </p>
                    <p className="text-base">
                      {format(new Date(admin.hire_date), 'PPP')}
                    </p>
                  </div>
                )}
              </div>
              {admin.notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-base">{admin.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="text-base">{admin.user.email}</p>
                </div>
                {admin.user.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="text-base">{admin.user.phone}</p>
                  </div>
                )}
                {admin.user.date_of_birth && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </p>
                    <p className="text-base">
                      {format(new Date(admin.user.date_of_birth), 'PPP')}
                    </p>
                  </div>
                )}
                {admin.user.gender && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-base capitalize">{admin.user.gender}</p>
                  </div>
                )}
                {admin.user.address && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="text-base">{admin.user.address}</p>
                  </div>
                )}
                {admin.user.last_login_at && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Login
                    </p>
                    <p className="text-base">
                      {format(new Date(admin.user.last_login_at), 'PPpp')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          {admin.roles && admin.roles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {admin.roles.map((role) => (
                    <Badge key={role.id} variant="outline" className="text-sm py-1 px-3">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions */}
          {permissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    permissions.reduce((acc, perm) => {
                      if (!acc[perm.module]) {
                        acc[perm.module] = []
                      }
                      acc[perm.module].push(perm)
                      return acc
                    }, {} as Record<string, typeof permissions>)
                  ).map(([module, modulePermissions]) => (
                    <div key={module}>
                      <p className="text-sm font-semibold mb-2 capitalize">{module}</p>
                      <div className="flex flex-wrap gap-2">
                        {modulePermissions.map((perm) => (
                          <Badge
                            key={perm.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {perm.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User Status</p>
                <Badge variant={getStatusBadgeVariant(admin.user.status)}>
                  {admin.user.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Admin Status
                </p>
                <Badge variant={getStatusBadgeVariant(admin.status)}>
                  {admin.status}
                </Badge>
              </div>
              {admin.user.email_verified_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Verified
                  </p>
                  <p className="text-sm">
                    {format(new Date(admin.user.email_verified_at), 'PPP')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {admin.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {format(new Date(admin.created_at), 'PPpp')}
                  </p>
                </div>
              )}
              {admin.updated_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Updated</p>
                  <p className="text-sm">
                    {format(new Date(admin.updated_at), 'PPpp')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

