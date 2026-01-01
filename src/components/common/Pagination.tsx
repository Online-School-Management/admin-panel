import { Button } from '@/components/ui/button'

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
}

interface PaginationProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  itemName?: string // e.g., "admins", "roles", "permissions"
}

/**
 * Reusable Pagination Component
 * Displays pagination controls with page numbers, Previous/Next buttons, and item count
 */
export function Pagination({ pagination, onPageChange, itemName = 'items' }: PaginationProps) {
  const { current_page, last_page, from, to, total } = pagination

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    // If 7 or fewer pages, show all
    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (current_page <= 3) {
        // Near the start: 1, 2, 3, 4, ..., last
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(last_page)
      } else if (current_page >= last_page - 2) {
        // Near the end: 1, ..., last-3, last-2, last-1, last
        pages.push('ellipsis')
        for (let i = last_page - 3; i <= last_page; i++) {
          pages.push(i)
        }
      } else {
        // In the middle: 1, ..., current-1, current, current+1, ..., last
        pages.push('ellipsis')
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(last_page)
      }
    }

    return pages
  }

  if (last_page <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {from || 0} to {to || 0} of {total} {itemName}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, current_page - 1))}
          disabled={current_page === 1}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            const pageNumber = pageNum as number
            const isCurrentPage = pageNumber === current_page

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? 'default' : 'outline'}
                size="sm"
                className={isCurrentPage ? '' : 'min-w-[2.5rem]'}
                onClick={() => onPageChange(pageNumber)}
                disabled={isCurrentPage}
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(last_page, current_page + 1))}
          disabled={current_page === last_page}
        >
          Next
        </Button>
      </div>
    </div>
  )
}


