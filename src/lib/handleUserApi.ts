'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// ✅ Define the type for UserProfile
export type UserProfile = {
  _id: string
  userId: string
  fullName: string
  email: string
  bio?: string
  phoneNumber?: string
  profileImage?: string
  fileType?: string
  uploadedAt?: string
}

export const useGetUserProfile = () => {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ''
  const userId = session?.user?.id

  return useQuery<UserProfile>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!token) throw new Error('No access token found')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.statusText}`)
      }

      const json = await res.json()
      return json.data as UserProfile
    },
    enabled: !!token,
    // staleTime: 1000 * 60 * 5, // cache for 5 minutes
  })
}
