'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
<<<<<<< HEAD
=======
import { create } from 'zustand'

type User = {
  _id: string
  email: string
  role: string
  profileImage?: string
}

type AuthData = {
  accessToken: string
  refreshToken: string
  user: User
}

type AuthStore = {
  authData: AuthData | null
  setAuthData: (data: AuthData) => void
  clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
  authData: null,
  setAuthData: data => set({ authData: data }),
  clearAuthData: () => set({ authData: null }),
}))
>>>>>>> origin/main

export default function Home() {
  const session = useSession()

  if (session.status === 'unauthenticated') {
    return redirect('/signin')
  }
  return redirect('/admin-dashboard')
}
