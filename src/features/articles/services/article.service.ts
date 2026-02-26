import apiClient from '@/services/api-client'
import type {
  ArticlesResponse,
  ArticleResponse,
  CreateArticleInput,
  UpdateArticleInput,
  CategoriesResponse,
} from '../types/article.types'

/**
 * Get all articles with filters and pagination
 */
export async function getArticles(params?: {
  page?: number
  per_page?: number
  search?: string
  category?: string
  status?: string
  sort_by?: string
  sort_order?: string
}): Promise<ArticlesResponse> {
  const response = await apiClient.get<ArticlesResponse>('/articles', { params })
  return response.data
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
  const response = await apiClient.get<ArticleResponse>(`/articles/${slug}`)
  return response.data
}

/**
 * Create a new article
 */
export async function createArticle(data: CreateArticleInput): Promise<ArticleResponse> {
  const response = await apiClient.post<ArticleResponse>('/articles', data)
  return response.data
}

/**
 * Update an existing article
 */
export async function updateArticle(
  slug: string,
  data: UpdateArticleInput
): Promise<ArticleResponse> {
  const response = await apiClient.put<ArticleResponse>(`/articles/${slug}`, data)
  return response.data
}

/**
 * Delete an article
 */
export async function deleteArticle(slug: string): Promise<void> {
  await apiClient.delete(`/articles/${slug}`)
}

/**
 * Get static categories list from backend
 */
export async function getArticleCategories(): Promise<CategoriesResponse> {
  const response = await apiClient.get<CategoriesResponse>('/articles/categories')
  return response.data
}
