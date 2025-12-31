import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface FormSkeletonProps {
  fieldsPerColumn?: number
  showActions?: boolean
  titleWidth?: string
}

/**
 * Reusable Form Skeleton component
 * Displays a form with skeleton loading state
 */
export function FormSkeleton({ 
  fieldsPerColumn = 3,
  showActions = true,
  titleWidth = 'w-32'
}: FormSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className={`h-6 ${titleWidth}`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, colIndex) => (
              <div key={colIndex} className="space-y-4">
                {[...Array(fieldsPerColumn)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {showActions && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

