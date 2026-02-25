import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, CheckCircle, XCircle, MoreVertical, RefreshCw } from 'lucide-react'
import format from 'date-fns/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEnrollmentRequests } from '../hooks/useEnrollmentRequests'
import { ApproveRequestDialog } from './ApproveRequestDialog'
import { RejectRequestDialog } from './RejectRequestDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION } from '@/constants'
import type { EnrollmentRequestCollectionItem } from '../types/enrollment-request.types'

export function EnrollmentRequestsList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const perPage = PAGINATION.DEFAULT_PER_PAGE

  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] =
    useState<EnrollmentRequestCollectionItem | null>(null)

  const { data, isLoading, error } = useEnrollmentRequests({
    page,
    per_page: perPage,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  })

  const handleApproveClick = (req: EnrollmentRequestCollectionItem) => {
    setSelectedRequest(req)
    setApproveDialogOpen(true)
  }

  const handleRejectClick = (req: EnrollmentRequestCollectionItem) => {
    setSelectedRequest(req)
    setRejectDialogOpen(true)
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('pending')
    setPage(1)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const
      case 'approved':
        return 'default' as const
      case 'rejected':
        return 'destructive' as const
      default:
        return 'secondary' as const
    }
  }

  const requests = data?.data || []
  const pagination = data?.meta?.pagination

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Something went wrong: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, phone, email, course..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
            {isLoading && (
              <TableSkeleton
                columns={[
                  { width: 'w-8', className: 'w-16' },
                  { width: 'w-32' },
                  { width: 'w-40' },
                  { width: 'w-24' },
                  { width: 'w-24' },
                  { width: 'w-32', className: 'hidden lg:table-cell' },
                  { width: 'w-8', className: 'text-right' },
                ]}
                rows={5}
              />
            )}
            {!isLoading && requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  {search || statusFilter !== 'pending'
                    ? 'No enrollment requests found matching your criteria.'
                    : 'No pending enrollment requests.'}
                </p>
              </div>
            ) : (
              <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req, index) => {
                      const rowNumber = pagination
                        ? (pagination.current_page - 1) * pagination.per_page + index + 1
                        : index + 1

                      return (
                        <TableRow key={req.id}>
                          <TableCell className="text-muted-foreground text-center">
                            {rowNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{req.name_en}</div>
                              <div className="text-sm text-muted-foreground">
                                {req.user?.email ?? '—'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{req.course?.title ?? '—'}</div>
                          </TableCell>
                          <TableCell className="text-sm">{req.phone}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(req.status)}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                            {req.created_at
                              ? format(new Date(req.created_at), 'MMM dd, yyyy')
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/enrollment-requests/${req.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                {req.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveClick(req)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRejectClick(req)}
                                      className="text-destructive"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          {!isLoading && pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              itemName="enrollment requests"
            />
          )}
        </div>
      </div>

      <ApproveRequestDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        request={selectedRequest}
      />
      <RejectRequestDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        request={selectedRequest}
      />
    </>
  )
}
