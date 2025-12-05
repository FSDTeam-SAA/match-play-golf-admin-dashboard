// ==================== FILE: store/authStore.ts ====================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthData } from '../../types/auth'

interface AuthState {
  authData: AuthData | null
  setAuthData: (data: AuthData) => void
  clearAuthData: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authData: null,
      setAuthData: (data) => set({ authData: data }),
      clearAuthData: () => set({ authData: null }),
    }),
    {
      name: 'auth-storage', // stored in localStorage
    }
  )
)
