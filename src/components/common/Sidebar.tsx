import { X } from 'lucide-react'
import { memo } from 'react'
import { NavItem } from './NavItem'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { mainNavigation, adminNavigation } from '@/constants/navigation'
import { useTranslation } from '@/i18n/context'

export const Sidebar = memo(function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)
  const { t } = useTranslation()
  
  // Map navigation items with translations
  const translatedMainNav = mainNavigation.map(item => ({
    ...item,
    label: t(`navigation.${item.to.replace('/', '')}`) || item.label
  }))
  
  const translatedAdminNav = adminNavigation.map(item => ({
    ...item,
    label: t(`navigation.${item.to.replace('/', '')}`) || item.label
  }))

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background shadow-sm overflow-hidden',
        // Only transition transform and width, not all properties
        // Use will-change to hint browser for better performance
        'transition-[transform,width] duration-300 ease-in-out will-change-[transform,width]',
        // Mobile: hide completely when closed
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0',
        // Desktop: collapse to icon-only when closed
        sidebarOpen ? 'lg:translate-x-0 lg:w-64' : 'lg:translate-x-0 lg:w-16'
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className={cn(
          'flex h-16 items-center border-b bg-muted/30 flex-shrink-0',
          // Only transition padding, not all properties
          'transition-[padding] duration-300',
          sidebarOpen ? 'justify-between px-6' : 'justify-center px-0'
        )}>
          {sidebarOpen ? (
            <>
              <h2 className="text-lg font-semibold flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {t('navigation.adminPanel')}
              </h2>
              {/* Close button - visible on mobile/tablet */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t('navigation.closeSidebar')}</span>
              </Button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          'flex-1 space-y-1 overflow-y-auto overflow-x-hidden',
          sidebarOpen ? 'p-4' : 'p-2'
        )}>
          {/* Main Navigation */}
          {translatedMainNav.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={!sidebarOpen}
              onClick={() => {
                // Close sidebar on mobile when item is clicked
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            />
          ))}

          {/* Separator */}
          <div className={cn('my-2', !sidebarOpen && 'px-2')}>
            <hr className="border-0 h-px bg-border" />
          </div>

          {/* Admin Navigation */}
          {translatedAdminNav.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={!sidebarOpen}
              onClick={() => {
                // Close sidebar on mobile when item is clicked
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false)
                }
              }}
            />
          ))}

        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="border-t p-4 flex-shrink-0">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Admin Panel
            </p>
          </div>
        )}
      </div>
    </aside>
  )
})

