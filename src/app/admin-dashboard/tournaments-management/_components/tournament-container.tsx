'use client'
import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import moment from 'moment'
import { Eye, Plus, Trash, SquarePen } from 'lucide-react'

import { Input } from '@/components/ui/input'
import DeleteModal from '@/components/modals/delete-modal'
// import TournamentView from "./tournament-view";
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { useDebounce } from '@/hooks/useDebounce'
import { TournamentApiResponse } from './tournament-data-type'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorContainer from '@/components/ErrorContainer/ErrorContainer'
import NotFound from '@/components/reusable/not-found-data'
import MatchPlayGolfPagination from '@/components/ui/match-play-golf-pagination'

const TournamentsManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [tournementId, setTournamentId] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const queryClient = useQueryClient()
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken
  console.log(token)

  console.log(search)

  // get tournament api
  const { data, isLoading, isError, error } = useQuery<TournamentApiResponse>({
    queryKey: ['tournaments', currentPage, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament?page=${currentPage}&limit=8&tournamentName=${debouncedSearch}`,
      )
      return res.json()
    },
  })

  let content

  if (isLoading) {
    content = (
      <div>
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
    data?.data &&
    data?.data?.tournaments &&
    data?.data?.tournaments?.length === 0
  ) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    )
  } else if (
    data &&
    data?.data &&
    data?.data?.tournaments &&
    data?.data?.tournaments?.length > 0
  ) {
    content = (
      <div>
        <Table className="">
          <TableHeader className="bg-[#FCE7E9] rounded-t-[12px]">
            <TableRow className="">
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] py-4 pl-6">
                Tournament Name
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
                Location
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
                Start Date
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
                End Date
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
                Players
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4 ">
                Status
              </TableHead>
              <TableHead className="text-sm font-normal leading-[150%] text-[#343A40] text-center py-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b border-x border-[#E6E7E6] rounded-b-[12px]">
            {data?.data?.tournaments?.map(item => {
              return (
                <TableRow key={item?._id} className="">
                  <TableCell className="text-base font-medium text-[#68706A] leading-[150%] pl-6 py-4">
                    {item?.tournamentName}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                    {item?.location}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                    {moment(item?.startDate).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell className="text-base font-normal text-[#68706A] leading-[150%] text-center py-4">
                    {moment(item?.endDate).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell className="text-base font-medium text-[#343A40] leading-[150%] text-center py-4">
                    {item?.totalParticipants}
                  </TableCell>
                  <TableCell className="text-base font-medium text-[#68706A] leading-[150%] text-center py-4">
                    <button
                      className={`w-[140px] h-[40px] ${
                        item?.status === 'Active'
                          ? 'bg-[#E6FAEE] text-[#27BE69] py-2 px-4'
                          : item?.status === 'Upcoming'
                          ? 'bg-[#EFF6FF] text-[#2563EB] py-2 px-4'
                          : 'bg-[#FEFCE8] text-[#CA8A04] py-2 px-4'
                      }`}
                    >
                      {item?.status}
                    </button>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-6 py-4">
                    <Link
                      href={`/admin-dashboard/tournaments-management/${item?._id}`}
                    >
                      <button className="mt-1">
                        <SquarePen className="cursor-pointer h-5 w-5 text-[#181818]" />
                      </button>
                    </Link>
                    <Link
                      href={`/admin-dashboard/tournaments-management/tournament-details/${item?._id}`}
                    >
                      <button className="cursor-pointer">
                        <Eye className="h-6 w-6 text-[#181818]" />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteModalOpen(true)
                        setTournamentId(item?._id)
                      }}
                      className="cursor-pointer"
                    >
                      <Trash className="h-6 w-6 text-primary" />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  console.log(data)

  // delete tournament api
  const { mutate } = useMutation({
    mutationKey: ['delete-tournament'],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return res.json()
    },
    onSuccess: data => {
      if (!data?.success) {
        toast.error(data?.message || 'Something went wrong')
        return
      }
      toast.success(data?.message || 'Tournament deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })

  const handleDelete = () => {
    if (tournementId) {
      mutate(tournementId)
    }
    setDeleteModalOpen(false)
  }
  return (
    <div>
      {/* table container */}
      <div className="p-6 space-y-6">
        {/* table header  */}
        <div className="w-full flex items-center justify-between">
          <div>
            <Input
              type="search"
              className="w-[300px] lg:w-[479px] h-[48px] border border-[#C0C3C1] rounded-[4px] outline-none right-0 text-base font-medium leading-[120%] text-[#343A40]"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <div>
            <Link href="/admin-dashboard/tournaments-management/create-tournament">
              <button className="flex items-center gap-2 bg-[#DF1020] p-3 rounded-[8px] text-[#F8F9FA] text-base font-medium leading-[150%] ">
                <Plus /> Create New Event
              </button>
            </Link>
          </div>
        </div>

        {/* table  */}
        <div>{content}</div>

        {/* pagination  */}
        {data &&
          data?.data &&
          data?.data?.pagination &&
          data?.data?.pagination?.totalPages > 1 && (
            <div className="w-full flex items-center justify-between pb-6">
              <p className="text-base font-normal text-[#68706A] leading-[150%]">
                Showing {data?.data?.pagination?.page} to 8 of{' '}
                {data?.data?.pagination?.total} results
              </p>
              <div>
                <MatchPlayGolfPagination
                  currentPage={currentPage}
                  totalPages={data?.data?.pagination?.totalPages}
                  onPageChange={page => setCurrentPage(page)}
                />
              </div>
            </div>
          )}

        {/* delete modal  */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this tournaments?"
          />
        )}
      </div>
    </div>
  )
}

export default TournamentsManagementContainer
