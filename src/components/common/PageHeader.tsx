import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  editTo?: string
  editLabel?: string
  addTo?: string
  addLabel?: string
  action?: ReactNode
}

/**
 * Reusable page header component
 * Used for consistent page headers across the application
 * Layout: Title on left, Back + Add + Edit buttons on right
 */
export function PageHeader({
  title,
  description,
  backTo,
  backLabel = 'Back',
  editTo,
  editLabel = 'Edit',
  addTo,
  addLabel = 'Add',
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left side - Title */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-primary tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      
      {/* Right side - Back, Add, and Edit buttons */}
      <div className="flex items-center gap-2">
        {backTo && (
          <Button asChild variant="outline">
            <Link to={backTo}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
        )}
        {addTo && (
          <Button asChild variant="default">
            <Link to={addTo}>
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Link>
          </Button>
        )}
        {editTo && (
          <Button asChild>
            <Link to={editTo}>
              <Edit className="h-4 w-4 mr-2" />
              {editLabel}
            </Link>
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}

