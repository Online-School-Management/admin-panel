import { memo } from 'react'
import { Sidebar } from '@/components/common/Sidebar'
import { MobileSidebar } from '@/components/common/MobileSidebar'
import { Header } from '@/components/common/Header'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

/**
 * Admin Layout
 * Main layout for authenticated pages with sidebar and header
 * Accepts children prop instead of using Outlet (matches example pattern)
 * Responsive design with mobile menu support
 * Memoized to prevent unnecessary re-renders
 */
export const AdminLayout = memo(function AdminLayout({ children }: AdminLayoutProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen',
          // Desktop: adjust margin based on sidebar state (64 = 256px full, 16 = 64px collapsed)
          // Use transition only for margin-left to prevent layout shifts on navigation
          'lg:transition-[margin-left] lg:duration-300 lg:ease-in-out lg:will-change-[margin-left]',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        )}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          <div className="w-full">
            {/* Page Content - Rendered via children prop */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
})

