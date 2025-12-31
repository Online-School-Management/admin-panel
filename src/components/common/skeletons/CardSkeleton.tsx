import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CardSkeletonProps {
  titleWidth?: string
  fieldsCount?: number
  fieldsPerRow?: 1 | 2 | 3 | 4
  showBadges?: boolean
  badgesCount?: number
}

/**
 * Reusable Card Skeleton component
 * Displays a card with skeleton loading state
 */
export function CardSkeleton({ 
  titleWidth = 'w-32', 
  fieldsCount = 4,
  fieldsPerRow = 2,
  showBadges = false,
  badgesCount = 3
}: CardSkeletonProps) {
  const gridColsClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[fieldsPerRow]

  return (
    <Card>
      <CardHeader>
        <Skeleton className={cn('h-6', titleWidth)} />
      </CardHeader>
      <CardContent className="space-y-4">
        {showBadges ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(badgesCount)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        ) : (
          <div className={cn('grid grid-cols-1 gap-4', gridColsClass)}>
            {[...Array(fieldsCount)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

