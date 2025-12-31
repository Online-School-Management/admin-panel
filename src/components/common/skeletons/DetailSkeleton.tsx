import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DetailSkeletonProps {
  showBackButton?: boolean
  showSidebar?: boolean
  cardsCount?: number
}

/**
 * Reusable Detail Page Skeleton component
 * Displays a detail page layout with skeleton loading state
 */
export function DetailSkeleton({ 
  showBackButton = false,
  showSidebar = false,
  cardsCount = 2
}: DetailSkeletonProps) {
  return (
    <div className="space-y-6">
      {showBackButton && (
        <Skeleton className="h-10 w-32" />
      )}
      
      <div className={`grid grid-cols-1 ${showSidebar ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Main Content */}
        <div className={showSidebar ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
          {[...Array(cardsCount)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

