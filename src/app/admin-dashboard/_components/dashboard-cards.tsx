'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, Trophy, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import DashboardCardsSkeleton from './dashboard-cards-skeleton'
import ErrorContainer from '@/components/ErrorContainer/ErrorContainer'

export interface DashboardOverviewResponse {
  success: boolean
  data: {
    cards: {
      activeTournaments: number
      totalPlayers: number
      ongoingMatches: number
    }
  }
  message: string
}

const CARD_CONFIG = [
  {
    key: 'activeTournaments',
    label: 'Active Tournaments',
    icon: Trophy,
    color: '#DF1020',
  },
  {
    key: 'totalPlayers',
    label: 'Total Players',
    icon: Users,
    color: '#DF1020',
  },
  {
    key: 'ongoingMatches',
    label: 'Ongoing Matches',
    icon: Calendar,
    color: '#DF1020',
  },
]

export function DashboardCards() {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const { data, isLoading, isError, error } =
    useQuery<DashboardOverviewResponse>({
      queryKey: ['dashboard-overview'],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard/overview`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        return await res.json()
      },
      enabled: !!token,
    })

  if (isLoading) {
    return (
      <div className="p-6">
        <DashboardCardsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorContainer message={error?.message || 'Something went wrong'} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {CARD_CONFIG.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]"
        >
          <div>
            <p className="text-sm font-semibold text-[#424242] leading-[120%]">
              {label}
            </p>
            <p className="text-3xl leading-[120%] text-[#DF1020] font-normal font-hexco pt-1">
              {data?.data?.cards?.[key as keyof typeof data.data.cards] || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#FCE7E9] p-3 rounded-full">
              <Icon className="w-6 h-6" style={{ color }} />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
