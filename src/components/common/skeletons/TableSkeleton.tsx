import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ColumnConfig {
  width?: string
  className?: string
  headerWidth?: string
  customCell?: (index: number) => ReactNode
}

interface TableSkeletonProps {
  columns: ColumnConfig[]
  rows?: number
  showOverlay?: boolean
}

/**
 * Reusable Table Skeleton component
 * Displays a table with skeleton loading state
 */
export function TableSkeleton({ 
  columns, 
  rows = 5,
  showOverlay = true 
}: TableSkeletonProps) {
  const skeletonContent = (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.className}>
              <Skeleton className={cn('h-4', col.headerWidth || col.width || 'w-24')} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rows)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex} className={col.className}>
                {col.customCell ? (
                  col.customCell(rowIndex)
                ) : (
                  <Skeleton className={cn('h-4', col.width || 'w-24')} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (showOverlay) {
    return (
      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm">
        {skeletonContent}
      </div>
    )
  }

  return skeletonContent
}

