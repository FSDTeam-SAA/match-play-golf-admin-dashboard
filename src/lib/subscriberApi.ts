// 📄 src/lib/api/subscribers.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  // Subscriber,
  SubscribersResponse,
  SingleSubscriberResponse,
  BroadcastEmailPayload,
  SpecificEmailPayload,
} from '@/../types/subscriber'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

// ==================== HELPER FUNCTION ====================
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL SUBSCRIBERS ====================
export const useGetSubscribers = (
  accessToken: string,
  page = 1,
  limit = 10,
) => {
  return useQuery<SubscribersResponse>({
    queryKey: ['subscribers', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/broadcast/subscribe?page=${page}&limit=${limit}`,
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

// ==================== GET SINGLE SUBSCRIBER ====================
export const useGetSingleSubscriber = (
  subscriberId?: string,
  accessToken?: string,
) => {
  return useQuery<SingleSubscriberResponse>({
    queryKey: ['subscriber', subscriberId],
    queryFn: async () => {
      if (!subscriberId) throw new Error('Subscriber ID is required')
      const res = await fetch(
        `${API_BASE_URL}/broadcast/subscribe/${subscriberId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return handleResponse(res)
    },
    enabled: !!subscriberId && !!accessToken,
  })
}

// ==================== DELETE SUBSCRIBER ====================
export const useDeleteSubscriber = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriberId: string) => {
      const res = await fetch(
        `${API_BASE_URL}/broadcast/subscribe/${subscriberId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })
}

// ==================== BROADCAST EMAIL TO ALL ====================
export const useBroadcastEmail = (accessToken: string) => {
  return useMutation({
    mutationFn: async (payload: BroadcastEmailPayload) => {
      const res = await fetch(`${API_BASE_URL}/broadcast`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      return handleResponse(res)
    },
  })
}

// ==================== SEND SPECIFIC EMAIL ====================
export const useSendSpecificEmail = (accessToken: string) => {
  return useMutation({
    mutationFn: async (payload: SpecificEmailPayload) => {
      const res = await fetch(`${API_BASE_URL}/broadcast/specific`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      return handleResponse(res)
    },
  })
}
