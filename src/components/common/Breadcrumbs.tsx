import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  to?: string
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'User Management',
  'user-management': 'User Management',
  new: 'Create User',
  edit: 'Edit User',
  settings: 'Settings',
  login: 'Login',
}

export const Breadcrumbs = memo(function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  if (pathnames.length === 0) {
    return null
  }

  // Build breadcrumbs, handling special cases
  const breadcrumbs: BreadcrumbItem[] = []
  
  for (let i = 0; i < pathnames.length; i++) {
    const pathname = pathnames[i]
    
    // Skip ID segments (UUIDs or long alphanumeric strings)
    if (pathname.length > 10 && /^[a-zA-Z0-9-]+$/.test(pathname)) {
      // Check if it's between 'users' and 'edit'
      if (i > 0 && pathnames[i - 1] === 'users' && pathnames[i + 1] === 'edit') {
        // Add "Edit User" instead of the ID
        breadcrumbs.push({
          label: 'Edit User',
          to: undefined,
        })
        i++ // Skip the 'edit' part as we've already handled it
        continue
      }
      // Otherwise, skip this ID segment
      continue
    }
    
    const to = `/${pathnames.slice(0, i + 1).join('/')}`
    const isLast = i === pathnames.length - 1
    
    breadcrumbs.push({
      label: routeLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1),
      to: isLast ? undefined : to,
    })
  }

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
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
              <span className={cn(isLast && 'text-primary font-medium')}>
                {crumb.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
})
