import { ReactNode } from 'react'
import { Sidebar } from '@/components/common/Sidebar'
import { MobileSidebar } from '@/components/common/MobileSidebar'
import { Header } from '@/components/common/Header'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * Admin Layout
 * Main layout for authenticated pages with sidebar and header
 * Responsive design with mobile menu support
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen',
          // Desktop: adjust margin based on sidebar state (64 = 256px full, 16 = 64px collapsed)
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        )}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className={cn(
          'flex-1',
          sidebarOpen 
            ? 'p-4 lg:p-6 xl:p-8' 
            : 'p-4 lg:pl-4 lg:pr-6 lg:py-6 xl:pl-4 xl:pr-8 xl:py-8'
        )}>
          <div className="w-full">
            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

