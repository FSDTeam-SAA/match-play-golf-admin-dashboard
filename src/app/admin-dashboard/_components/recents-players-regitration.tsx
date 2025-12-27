'use client'

import Link from 'next/link'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import Image from 'next/image'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorContainer from '@/components/ErrorContainer/ErrorContainer'
import NotFound from '@/components/reusable/not-found-data'

type Registration = {
  id: string
  user: {
    id: string
    name: string
    email: string
    profileImage: string
  }
  tournament: {
    id: string
    name: string
  }
  createdAt: string
}

type RecentRegistrationsResponse = {
  success: boolean
  data: {
    recentRegistrations: Registration[]
  }
  message: string
}

export function RecentRegistrations() {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const { data, isLoading, isError, error } =
    useQuery<RecentRegistrationsResponse>({
      queryKey: ['recent-registrations'],
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
    data?.data?.recentRegistrations &&
    data?.data?.recentRegistrations?.length === 0
  ) {
    content = (
      <div>
        <NotFound message="Oops! No data available." />
      </div>
    )
  } else if (
    data &&
    data?.data?.recentRegistrations &&
    data?.data?.recentRegistrations?.length > 0
  ) {
    content = (
      <div>
        {data?.data?.recentRegistrations?.map(item => {
          return (
            <div
              key={item?.id}
              className="w-full flex items-center justify-between border-b border-[#E6E6E8] py-4 px-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {item?.user?.profileImage ? (
                    <Image
                      src={item?.user?.profileImage}
                      alt={item?.user?.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#DF1020] text-white font-semibold">
                      {item?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold leading-[150%] text-[#181818] truncate">
                    {item?.user?.name}
                  </h4>
                  <p className="text-xs font-normal leading-[150%] text-[#616161] truncate">
                    {item?.user?.email}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-sm font-medium leading-[150%] text-[#181818] truncate max-w-[150px]">
                  {item?.tournament?.name}
                </p>
                <p className="text-xs font-normal leading-[150%] text-[#616161]">
                  {moment(item?.createdAt).fromNow()}
                </p>
              </div>
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
          Player Registrations
        </h4>
        <Link href="/admin-dashboard/players-management">
          <button className="text-sm font-medium leading-[150%] text-[#DF1020] cursor-pointer hover:underline">
            View All
          </button>
        </Link>
      </div>
      <div>{content}</div>
    </div>
  )
}
