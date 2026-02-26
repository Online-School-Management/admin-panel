import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleCategories,
} from '../services/article.service'
import {
  showCreateSuccessToast,
  showUpdateSuccessToast,
  showDeleteSuccessToast,
  showCreateErrorToast,
  showUpdateErrorToast,
  showDeleteErrorToast,
} from '@/utils/toast'
import type {
  CreateArticleInput,
  UpdateArticleInput,
} from '../types/article.types'

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  categories: () => [...articleKeys.all, 'categories'] as const,
}

export function useArticles(params?: {
  page?: number
  per_page?: number
  search?: string
  category?: string
  status?: string
  sort_by?: string
  sort_order?: string
}) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () => getArticles(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}

export function useArticleCategories() {
  return useQuery({
    queryKey: articleKeys.categories(),
    queryFn: () => getArticleCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour — static data
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateArticleInput) => createArticle(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.refetchQueries({ queryKey: articleKeys.lists() })
      showCreateSuccessToast('article', `${response.data.title} has been added`)
      navigate('/articles')
    },
    onError: (error: unknown) => {
      showCreateErrorToast('article', error)
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateArticleInput }) =>
      updateArticle(slug, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.refetchQueries({ queryKey: articleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.slug) })
      queryClient.refetchQueries({ queryKey: articleKeys.detail(variables.slug) })
      showUpdateSuccessToast('article', `${response.data.title} has been updated`)
      navigate('/articles')
    },
    onError: (error: unknown) => {
      showUpdateErrorToast('article', error)
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteArticle(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.refetchQueries({ queryKey: articleKeys.lists() })
      showDeleteSuccessToast('article')
    },
    onError: (error: unknown) => {
      showDeleteErrorToast('article', error)
    },
  })
}
