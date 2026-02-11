import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/context'

interface BreadcrumbItem {
  label: string
  to?: string
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  admins: 'Admins',
  roles: 'Roles',
  permissions: 'Permissions',
  'monthly-closing': 'Monthly closing',
  new: 'Create',
  edit: 'Edit',
  login: 'Login',
}

export const Breadcrumbs = memo(function Breadcrumbs() {
  const location = useLocation()
  const { t } = useTranslation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  if (pathnames.length === 0) {
    return null
  }

  // Build breadcrumbs, handling special cases
  const breadcrumbs: BreadcrumbItem[] = []
  
  for (let i = 0; i < pathnames.length; i++) {
    const pathname = pathnames[i]
    
    // Skip only actual ID segments: numeric IDs or UUIDs (not route names like "monthly-closing")
    const isNumericId = /^\d+$/.test(pathname)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pathname)
    if (isNumericId || isUuid) {
      if (i > 0 && pathnames[i - 1] === 'admins' && pathnames[i + 1] === 'edit') {
        breadcrumbs.push({ label: 'Edit Admin', to: undefined })
        i++
        continue
      }
      // Skip ID in detail pages (admins/:id, roles/:id, etc.)
      continue
    }
    
    const to = `/${pathnames.slice(0, i + 1).join('/')}`
    const isLast = i === pathnames.length - 1
    const label =
      routeLabels[pathname] ||
      t(`navigation.${pathname}`) ||
      pathname.charAt(0).toUpperCase() + pathname.slice(1).replace(/-/g, ' ')

    breadcrumbs.push({
      label,
      to: isLast ? undefined : to,
    })
  }

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-base text-muted-foreground">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {crumb.to && !isLast ? (
              <Link
                to={crumb.to}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast && 'text-primary text-lg font-bold'
                )}
              >
                {crumb.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
})
