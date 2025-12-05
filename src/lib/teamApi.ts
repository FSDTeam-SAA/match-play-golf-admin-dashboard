// 📄 src/lib/api/team.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  // TeamMember,
  TeamResponse,
  SingleTeamResponse,
  TeamFormData,
} from '@/../types/team'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// ==================== GET ALL TEAM MEMBERS ====================
export const useGetTeamMembers = (accessToken: string) => {
  return useQuery<TeamResponse>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin-team`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!accessToken,
  })
}

// ==================== GET SINGLE TEAM MEMBER ====================
export const useGetSingleTeamMember = (
  memberId?: string,
  accessToken?: string,
) => {
  return useQuery<SingleTeamResponse>({
    queryKey: ['team-member', memberId],
    queryFn: async () => {
      if (!memberId) throw new Error('Member ID is required')
      const res = await fetch(`${API_BASE_URL}/admin-team/${memberId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    enabled: !!memberId && !!accessToken,
  })
}

// ==================== CREATE TEAM MEMBER ====================
export const useCreateTeamMember = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TeamFormData) => {
      const formData = new FormData()
      formData.append('memberName', data.memberName)
      formData.append('designation', data.designation)
      formData.append('description', data.description)
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      const res = await fetch(`${API_BASE_URL}/admin-team`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
    },
  })
}

// ==================== UPDATE TEAM MEMBER ====================
export const useUpdateTeamMember = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberId,
      data,
    }: {
      memberId: string
      data: TeamFormData
    }) => {
      const formData = new FormData()
      formData.append('memberName', data.memberName)
      formData.append('designation', data.designation)
      formData.append('description', data.description)
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      const res = await fetch(`${API_BASE_URL}/admin-team/${memberId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
      queryClient.invalidateQueries({ queryKey: ['team-member'] })
    },
  })
}

// ==================== DELETE TEAM MEMBER ====================
export const useDeleteTeamMember = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`${API_BASE_URL}/admin-team/${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return handleResponse(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
    },
  })
}
