/**
 * Article types and interfaces
 */

export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id: number
  slug: string
  title: string
  category?: string | null
  excerpt?: string | null
  body: string
  image_url?: string | null
  status: ArticleStatus
  published_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface ArticleCollectionItem {
  id: number
  slug: string
  title: string
  category?: string | null
  excerpt?: string | null
  image_url?: string | null
  status: ArticleStatus
  published_at?: string | null
  created_at: string
}

export interface CreateArticleInput {
  title: string
  category?: string | null
  excerpt?: string | null
  body: string
  image_url?: string | null
  status?: ArticleStatus
}

export interface UpdateArticleInput {
  title?: string
  category?: string | null
  excerpt?: string | null
  body?: string
  image_url?: string | null
  status?: ArticleStatus
}

export interface ArticlesResponse {
  success: boolean
  message?: string
  data: ArticleCollectionItem[]
  meta?: {
    pagination: {
      current_page: number
      per_page: number
      total: number
      last_page: number
      from: number | null
      to: number | null
    }
  }
}

export interface ArticleResponse {
  success: boolean
  message?: string
  data: Article
}

export interface CategoriesResponse {
  success: boolean
  message?: string
  data: Record<string, string>
}
