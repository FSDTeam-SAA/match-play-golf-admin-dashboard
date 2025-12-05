/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Types
export interface Podcast {
  _id: string
  title: string
  mediaName: string
  description: string
  uploadThumbnail: string
  linkName: string
  linkUrl: string
  publicId: string | null
  cloudinaryId: string | null
  fileType: string
  mimeType: string | null
  fileSize: number | null
  uploadedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PodcastsResponse {
  status: boolean
  message: string
  data: {
    podcasts: Podcast[]
    pagination: {
      currentPage: number
      totalPages: number
      totalData: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export interface SinglePodcastResponse {
  status: boolean
  message: string
  data: Podcast
}

// Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL PODCASTS ====================
export const useGetPodcasts = (accessToken: string, page = 1, limit = 10) => {
  return useQuery<PodcastsResponse>({
    queryKey: ['podcasts', page, limit, accessToken],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/podcasts?page=${page}&limit=5`, {
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

// ==================== GET SINGLE PODCAST ====================
export const useGetSinglePodcast = (
  podcastId?: string,
  accessToken?: string
) => {
  return useQuery<SinglePodcastResponse>({
    queryKey: ['podcast', podcastId, accessToken],
    queryFn: async () => {
      if (!podcastId) return null
      const res = await fetch(`${API_BASE_URL}/podcasts/${podcastId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!podcastId && !!accessToken,
  })
}

// ==================== ADD PODCAST ====================
export const useAddPodcast = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/podcasts`, {
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
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== UPDATE PODCAST ====================
export const useUpdatePodcast = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      podcastId,
      data,
    }: {
      podcastId: string
      data: any
    }) => {
      const res = await fetch(`${API_BASE_URL}/podcasts/${podcastId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['podcast'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== DELETE PODCAST ====================
export const useDeletePodcast = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (podcastId: string) => {
      const res = await fetch(`${API_BASE_URL}/podcasts/${podcastId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
    },
  })
}
