/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

// Types
export type UserProfile = {
  _id: string
  userId: string
  username?: string
  fullName: string
  email: string
  role?: string
  organizationName?: string | ''
  phone?: string
  profileImage?: string
  fileType?: string
  uploadedAt?: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

export interface UpdateProfileData {
  fullName?: string
  username?: string
  role?: string
  phoneNumber?: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

// Helper to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET USER PROFILE ====================
export const useGetUserProfile = (accessToken: string) => {
  return useQuery<ProfileResponse>({
    queryKey: ['user-profile', accessToken],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })
      return handleResponse(res)
    },
    enabled: !!accessToken,
  })
}

// ==================== UPDATE PROFILE ====================
export const useUpdateProfile = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      options?.onSuccess?.()
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}

// ==================== UPDATE PROFILE IMAGE ====================
export const useUpdateProfileImage = (accessToken: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/user/profile/image`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      options?.onSuccess?.()
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}

// ==================== CHANGE PASSWORD ====================
export const useChangePassword = (accessToken: string, options?: any) => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: error => {
      options?.onError?.(error)
    },
  })
}
