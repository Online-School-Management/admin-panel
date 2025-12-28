import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  icon: LucideIcon
  label: string
  collapsed?: boolean
  onClick?: () => void
}

export function NavItem({ to, icon: Icon, label, collapsed = false, onClick }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <Link
      to={to}
      onClick={onClick}
      style={isActive ? {
        backgroundColor: 'hsl(var(--primary-active-bg))',
        color: 'hsl(var(--primary))',
      } : undefined}
      className={cn(
        'flex items-center rounded-lg transition-all duration-200 relative group w-full',
        collapsed 
          ? 'justify-center px-2 py-2.5 min-w-0' 
          : 'gap-3 px-3 py-2.5',
        isActive
          ? 'shadow-sm font-semibold'
          : 'text-muted-foreground hover:bg-accent hover:text-primary'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon 
        style={isActive ? { color: 'hsl(var(--primary))' } : undefined}
        className={cn(
          'flex-shrink-0',
          collapsed ? 'h-5 w-5' : 'h-5 w-5',
          !isActive && 'text-muted-foreground'
        )} 
      />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
          {label}
        </span>
      )}
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          {label}
        </span>
      )}
    </Link>
  )
}

