// store/useTournamentStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TournamentStep1 {
  tournamentName: string
  sportName: string
  drawFormat: string
  format: string
  totalDrawSize: string // keep as string from form
  terms: boolean
}

export interface BillingData {
  fullName: string
  email: string
  phone: string
  companyName?: string
  country: string
  streetAddress: string
  city: string
  district?: string
  zipcode: string
}

interface TournamentStore {
  step: 1 | 2
  step1Data: TournamentStep1 | null

  setStep: (step: 1 | 2) => void
  setStep1Data: (data: TournamentStep1) => void
  reset: () => void
}

export const useTournamentStore = create<TournamentStore>()(
  persist(
    set => ({
      step: 1,
      step1Data: null,

      setStep: step => set({ step }),
      setStep1Data: data => set({ step1Data: data, step: 2 }),
      reset: () => set({ step: 1, step1Data: null }),
    }),
    {
      name: 'tournament-storage',
    },
  ),
)
