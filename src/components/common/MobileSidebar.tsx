import { Home, Users, Settings } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { NavItem } from './NavItem'
import { useUIStore } from '@/store/uiStore'

const navigation = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileSidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore()

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle>Admin Panel</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Admin Panel
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}


