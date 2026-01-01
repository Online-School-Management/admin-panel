import { Menu, Bell } from 'lucide-react'
import { memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumbs } from './Breadcrumbs'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTranslation } from '@/i18n/context'

export const Header = memo(function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu)
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()
  const { t } = useTranslation()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Breadcrumbs */}
        <div className="hidden md:flex flex-1 min-w-0">
          <Breadcrumbs />
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Notifications - Hidden on mobile */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('common.buttons.view')} Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              {t('common.buttons.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
})

