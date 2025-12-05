/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Types
export interface Service {
  _id: string
  serviceName: string
  sessionInfo: string
  description: string
  uploadPhoto: string
  publicId: string | null
  cloudinaryId: string | null
  fileType: string
  mimeType: string | null
  fileSize: number | null
  uploadedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ServicesResponse {
  success: boolean
  pagination: {
    currentPage: number
    totalPages: number
    totalData: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  services: Service[]
}

export interface SingleServiceResponse {
  success: boolean
  message: string
  service: Service
}

// Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL SERVICES ====================
export const useGetServices = (accessToken: string, page = 1, limit = 10) => {
  return useQuery<ServicesResponse>({
    queryKey: ['services', page, limit, accessToken],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/services?page=${page}&limit=5`, {
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

// ==================== GET SINGLE SERVICE ====================
export const useGetSingleService = (
  serviceId?: string,
  accessToken?: string
) => {
  return useQuery<SingleServiceResponse>({
    queryKey: ['service', serviceId, accessToken],
    queryFn: async () => {
      if (!serviceId) return null
      const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!serviceId && !!accessToken,
  })
}

// ==================== ADD SERVICE ====================
export const useAddService = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/services`, {
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
      queryClient.invalidateQueries({ queryKey: ['services'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== UPDATE SERVICE ====================
export const useUpdateService = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      serviceId,
      data,
    }: {
      serviceId: string
      data: any
    }) => {
      const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
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
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['service'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== DELETE SERVICE ====================
export const useDeleteService = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
