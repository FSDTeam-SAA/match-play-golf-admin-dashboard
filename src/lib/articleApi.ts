// 📄 src/lib/api/articles.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  // Article,
  ArticlesResponse,
  SingleArticleResponse,
  ArticleFormData,
} from '@/../types/article'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}
//for testing
// ==================== GET ALL ARTICLES ====================
export const useGetArticles = (accessToken: string, page = 1, limit = 10) => {
  return useQuery<ArticlesResponse>({
    queryKey: ['articles', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/article?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return handleResponse(res)
    },
    enabled: !!accessToken,
  })
}

// ==================== GET SINGLE ARTICLE ====================
export const useGetSingleArticle = (
  articleId?: string,
  accessToken?: string,
) => {
  return useQuery<SingleArticleResponse>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      if (!articleId) throw new Error('Article ID is required')
      const res = await fetch(`${API_BASE_URL}/article/${articleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!articleId && !!accessToken,
  })
}

// ==================== CREATE ARTICLE ====================
export const useCreateArticle = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('type', data.type)
      if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage)
      }

      const res = await fetch(`${API_BASE_URL}/article`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

// ==================== UPDATE ARTICLE ====================
export const useUpdateArticle = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      articleId,
      data,
    }: {
      articleId: string
      data: ArticleFormData
    }) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('type', data.type)
      if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage)
      }

      const res = await fetch(`${API_BASE_URL}/article/${articleId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article'] })
    },
  })
}

// ==================== DELETE ARTICLE ====================
export const useDeleteArticle = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (articleId: string) => {
      const res = await fetch(`${API_BASE_URL}/article/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}
