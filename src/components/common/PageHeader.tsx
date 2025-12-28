import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  action?: ReactNode
}

/**
 * Reusable page header component
 * Used for consistent page headers across the application
 */
export function PageHeader({
  title,
  description,
  backTo,
  backLabel = 'Back',
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {backTo && (
          <Button asChild variant="default">
            <Link to={backTo}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}

