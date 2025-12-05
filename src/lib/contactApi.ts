/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Types
export interface Contact {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  occupation: string
  message: string
  status: 'New' | 'Respond'
  createdAt: string
  updatedAt: string
}

export interface ContactsResponse {
  status: boolean
  message: string
  data: {
    contracts: Contact[]
    pagination: {
      currentPage: number
      totalPages: number
      totalData: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export interface SingleContactResponse {
  status: boolean
  message: string
  data: Contact
}

// Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL CONTACTS ====================
export const useGetContacts = (accessToken: string, page = 1, limit = 10) => {
  return useQuery<ContactsResponse>({
    queryKey: ['contacts', page, limit, accessToken],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/contracts?page=${page}&limit=5`,
        {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return handleResponse(res)
    },
    enabled: !!accessToken,
  })
}

// ==================== GET SINGLE CONTACT ====================
export const useGetSingleContact = (
  contactId?: string,
  accessToken?: string
) => {
  return useQuery<SingleContactResponse>({
    queryKey: ['contact', contactId, accessToken],
    queryFn: async () => {
      if (!contactId) return null
      const res = await fetch(`${API_BASE_URL}/contracts/${contactId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!contactId && !!accessToken,
  })
}

// ==================== UPDATE CONTACT STATUS ====================
export const useUpdateContactStatus = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      contactId,
      responseMessage,
    }: {
      contactId: string
      responseMessage: string
    }) => {
      const res = await fetch(`${API_BASE_URL}/contracts/${contactId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ responseMessage }),
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

// ==================== DELETE CONTACT ====================
export const useDeleteContact = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contactId: string) => {
      const res = await fetch(`${API_BASE_URL}/contracts/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
