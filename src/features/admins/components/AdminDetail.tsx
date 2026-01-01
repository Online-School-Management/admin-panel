import { Mail, Phone, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CardSkeleton } from '@/components/common/skeletons/CardSkeleton'
import { useAdmin, useAdminPermissions } from '../hooks/useAdmins'
import { format } from 'date-fns'
import type { Admin } from '../types/admin.types'
import { useTranslation } from '@/i18n/context'

interface AdminDetailProps {
  adminId: string
}

/**
 * AdminDetail component - displays detailed admin information
 */
export function AdminDetail({ adminId }: AdminDetailProps) {
  const { t } = useTranslation()
  const { data: adminData, isLoading, error } = useAdmin(parseInt(adminId))
  const { data: permissionsData } = useAdminPermissions(parseInt(adminId))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton titleWidth="w-32" fieldsCount={4} fieldsPerRow={2} />
            <CardSkeleton titleWidth="w-32" fieldsCount={4} fieldsPerRow={2} />
            <CardSkeleton titleWidth="w-20" showBadges={true} badgesCount={3} />
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <CardSkeleton titleWidth="w-28" fieldsCount={3} fieldsPerRow={1} />
            <CardSkeleton titleWidth="w-24" fieldsCount={2} fieldsPerRow={1} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('admin.detail.errorLoading')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!adminData?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t('admin.messages.adminNotFound')}</p>
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

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.detail.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.adminId')}</p>
                  <p className="text-base font-semibold">{admin.admin_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.adminStatus')}</p>
                  <Badge variant={getStatusBadgeVariant(admin.status)}>
                    {getStatusLabel(admin.status)}
                  </Badge>
                </div>
                {admin.department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('admin.form.department')}
                    </p>
                    <p className="text-base">{admin.department}</p>
                  </div>
                )}
                {admin.hire_date && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('admin.detail.hireDate')}
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
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.notes')}</p>
                    <p className="text-base">{admin.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.detail.userInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('common.labels.email')}
                  </p>
                  <p className="text-base">{admin.user.email}</p>
                </div>
                {admin.user.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('admin.detail.phone')}
                    </p>
                    <p className="text-base">{admin.user.phone}</p>
                  </div>
                )}
                {admin.user.date_of_birth && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('admin.detail.dateOfBirth')}
                    </p>
                    <p className="text-base">
                      {format(new Date(admin.user.date_of_birth), 'PPP')}
                    </p>
                  </div>
                )}
                {admin.user.gender && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.gender')}</p>
                    <p className="text-base capitalize">{admin.user.gender}</p>
                  </div>
                )}
                {admin.user.address && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('admin.detail.address')}
                    </p>
                    <p className="text-base">{admin.user.address}</p>
                  </div>
                )}
                {admin.user.last_login_at && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('admin.detail.lastLogin')}
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
                <CardTitle>{t('admin.detail.roles')}</CardTitle>
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
                <CardTitle>{t('admin.detail.permissions')}</CardTitle>
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
              <CardTitle>{t('admin.detail.auditInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.userStatus')}</p>
                <Badge variant={getStatusBadgeVariant(admin.user.status)}>
                  {getStatusLabel(admin.user.status)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('admin.detail.adminStatus')}
                </p>
                <Badge variant={getStatusBadgeVariant(admin.status)}>
                  {getStatusLabel(admin.status)}
                </Badge>
              </div>
              {admin.user.email_verified_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('admin.detail.emailVerified')}
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
              <CardTitle>{t('admin.detail.timestamps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {admin.created_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.created')}</p>
                  <p className="text-sm">
                    {format(new Date(admin.created_at), 'PPpp')}
                  </p>
                </div>
              )}
              {admin.updated_at && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.detail.updated')}</p>
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

