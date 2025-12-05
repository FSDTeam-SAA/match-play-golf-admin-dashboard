/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BlogsResponse, SingleBlogResponse } from '../../types/blog'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ✅ Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL BLOGS ====================
export const useGetBlogs = (accessToken: string, page = 1, limit = 10) => {
  return useQuery<BlogsResponse>({
    queryKey: ['blogs', page, limit, accessToken],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/blogs?page=${page}&limit=5`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!accessToken,
  })
}

// ==================== GET SINGLE BLOG ====================
export const useGetSingleBlog = (blogId?: string, accessToken?: string) => {
  return useQuery<SingleBlogResponse>({
    queryKey: ['blog', blogId, accessToken],
    queryFn: async () => {
      if (!blogId) return null
      const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!blogId && !!accessToken,
  })
}

// ==================== ADD BLOG ====================
export const useAddBlog = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== UPDATE BLOG ====================
export const useUpdateBlog = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ blogId, data }: { blogId: string; data: any }) => {
      const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data, // allow FormData or JSON
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== DELETE BLOG ====================
export const useDeleteBlog = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (blogId: string) => {
      const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}
