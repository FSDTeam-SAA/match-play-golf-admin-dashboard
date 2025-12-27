'use client'

import Link from 'next/link'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorContainer from '@/components/ErrorContainer/ErrorContainer'
import NotFound from '@/components/reusable/not-found-data'

type Tournament = {
  _id: string
  tournamentName: string
  createdAt: string
}

type RecentTournamentsResponse = {
  success: boolean
  data: {
    recentTournaments: Tournament[]
  }
  message: string
}

export function RecentTournaments() {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const { data, isLoading, isError, error } =
    useQuery<RecentTournamentsResponse>({
      queryKey: ['recent-tournaments'],
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
        return res.json()
      },
      enabled: !!token,
    })

  let content

  if (isLoading) {
    content = (
      <div className="pt-4">
        <TableSkeleton />
      </div>
    )
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || 'Something went wrong'} />
      </div>
    )
  } else if (
    data &&
    data?.data?.recentTournaments &&
    data?.data?.recentTournaments?.length === 0
  ) {
    content = (
      <div>
        <NotFound message="Oops! No data available." />
      </div>
    )
  } else if (
    data &&
    data?.data?.recentTournaments &&
    data?.data?.recentTournaments?.length > 0
  ) {
    content = (
      <div>
        {data?.data?.recentTournaments?.map(item => {
          return (
            <div
              key={item?._id}
              className="w-full flex items-center justify-between border-b border-[#E6E6E8] py-4 px-2"
            >
              <h4 className="text-base font-semibold leading-[150%] text-[#181818] flex-1">
                {item?.tournamentName}
              </h4>
              <p className="text-sm font-normal leading-[150%] text-[#616161]">
                {moment(item?.createdAt).format('MMM D, YYYY')}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E6E6E8] p-6 rounded-[12px]">
      <div className="w-full flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold leading-[150%] text-[#343A40] font-hexco">
          Recent Tournaments
        </h4>
        <Link href="/admin-dashboard/tournaments-management">
          <button className="text-sm font-medium leading-[150%] text-[#DF1020] cursor-pointer hover:underline">
            View All
          </button>
        </Link>
      </div>
      <div>{content}</div>
    </div>
  )
}
