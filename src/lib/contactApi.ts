// 📄 src/lib/api/contacts.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ContactsResponse,
  SingleContactResponse,
} from '@/../types/contact'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

// Helper function
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
    queryKey: ['contacts', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/contact?page=${page}&limit=${limit}`,
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
<<<<<<< HEAD

=======
//dasjkfas
>>>>>>> origin/main
// ==================== GET SINGLE CONTACT ====================
export const useGetSingleContact = (
  contactId?: string,
  accessToken?: string,
) => {
  return useQuery<SingleContactResponse>({
    queryKey: ['contact', contactId],
    queryFn: async () => {
      if (!contactId) throw new Error('Contact ID is required')
      const res = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!contactId && !!accessToken,
  })
}

// ==================== DELETE CONTACT ====================
export const useDeleteContact = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contactId: string) => {
      const res = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
        method: 'DELETE',
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
