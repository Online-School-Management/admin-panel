import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit, Trash2, Eye, MoreVertical, RefreshCw } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useArticles, useDeleteArticle, useArticleCategories } from '../hooks/useArticles'
import { DeleteArticleDialog } from './DeleteArticleDialog'
import { Pagination } from '@/components/common/Pagination'
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton'
import { PAGINATION } from '@/constants'
import format from 'date-fns/format'
import type { ArticleCollectionItem } from '../types/article.types'
import { useTranslation } from '@/i18n/context'

export function ArticlesList() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const perPage = PAGINATION.DEFAULT_PER_PAGE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleCollectionItem | null>(null)

  const { data, isLoading, error } = useArticles({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  })

  const { data: categoriesData } = useArticleCategories()
  const deleteArticle = useDeleteArticle()

  const handleDeleteClick = (article: ArticleCollectionItem) => {
    setSelectedArticle(article)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedArticle) {
      deleteArticle.mutate(selectedArticle.slug, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSelectedArticle(null)
        },
      })
    }
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setCategoryFilter('')
    setPage(1)
  }

  const articles = data?.data || []
  const pagination = data?.meta?.pagination
  const categories = categoriesData?.data || {}

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            {t('common.messages.somethingWentWrong')}: {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('article.filters.searchArticles')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value === 'all' ? '' : value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t('article.filters.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('article.filters.allStatuses')}</SelectItem>
              <SelectItem value="published">{t('article.filters.published')}</SelectItem>
              <SelectItem value="draft">{t('article.filters.draft')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value === 'all' ? '' : value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t('article.filters.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('article.filters.allCategories')}</SelectItem>
              {Object.entries(categories).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('article.actions.clear')}
          </Button>
        </div>

        {/* Table */}
        <div className="space-y-4">
          <div className="rounded-md border relative min-h-[400px]">
            {isLoading && (
              <TableSkeleton
                columns={[
                  { width: 'w-8', className: 'w-16' },
                  { width: 'w-40' },
                  { width: 'w-24' },
                  { width: 'w-24' },
                  { width: 'w-24', className: 'hidden lg:table-cell' },
                  { width: 'w-8', className: 'text-right' },
                ]}
                rows={5}
              />
            )}
            {!isLoading && articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">
                  {search ? t('article.messages.noArticlesFound') : t('article.messages.noArticles')}
                </p>
              </div>
            ) : (
              <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">{t('article.table.no')}</TableHead>
                      <TableHead>{t('article.table.title')}</TableHead>
                      <TableHead>{t('article.table.category')}</TableHead>
                      <TableHead>{t('article.table.status')}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t('article.table.created')}</TableHead>
                      <TableHead className="text-right">{t('article.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article, index) => {
                      const rowNumber = pagination
                        ? (pagination.current_page - 1) * pagination.per_page + index + 1
                        : index + 1

                      const isPublished = article.status === 'published'

                      return (
                        <TableRow key={article.id}>
                          <TableCell className="text-muted-foreground text-center">
                            {rowNumber}
                          </TableCell>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>
                            {article.category ? (
                              <Badge variant="secondary">
                                {categories[article.category] || article.category}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isPublished ? 'default' : 'outline'}>
                              {isPublished ? t('article.status.published') : t('article.status.draft')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                            {article.created_at
                              ? format(new Date(article.created_at), 'MMM dd, yyyy')
                              : '-'}
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
                                  <Link to={`/articles/${article.slug}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {t('article.actions.view')}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/articles/${article.slug}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t('article.actions.edit')}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(article)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t('article.actions.delete')}
                                </DropdownMenuItem>
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
              itemName={t('article.pages.list').toLowerCase()}
            />
          )}
        </div>
      </div>

      <DeleteArticleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        articleTitle={selectedArticle?.title || ''}
        isLoading={deleteArticle.isPending}
      />
    </>
  )
}
