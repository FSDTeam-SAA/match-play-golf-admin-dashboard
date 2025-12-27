// 📄 src/app/admin-dashboard/subscriber-management/page.tsx

'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { DataTable } from '@/components/data-table/data-table'
import { createColumns } from './columns'

import { useGetSubscribers, useDeleteSubscriber } from '@/lib/subscriberApi'
import type { Subscriber } from '@/../types/subscriber'
import { useQueryClient } from '@tanstack/react-query'
import BroadcastModal from './boardcastModal'
import SpecificEmailModal from './specificEmailModal'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorState from '@/components/reusable/ErrorState'
import { toast } from 'sonner' // or use your toast library
import { DeleteModal } from './deleteModal'

export default function SubscriberManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [showSpecificModal, setShowSpecificModal] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Subscriber | null>(null)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<Subscriber | null>(null)

  const cu = useSession()
  const accessToken = cu?.data?.user?.accessToken || ''

  const queryClient = useQueryClient()

  // Fetch subscribers
  const { data, isLoading, isError } = useGetSubscribers(
    accessToken,
    currentPage,
    10,
  )

  // Delete mutation
  const { mutate: deleteSubscriber, isPending: isDeleting } =
    useDeleteSubscriber(accessToken)

  const handleOpenDeleteModal = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSubscriberToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (!subscriberToDelete) return

    deleteSubscriber(subscriberToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['subscribers'] })
        toast.success('Subscriber deleted successfully')
        handleCloseDeleteModal()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(`Failed to delete subscriber: ${error.message}`)
      },
    })
  }

  const handleSendEmail = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber)
    setShowSpecificModal(true)
  }

  const columns = createColumns({
    onSendEmail: handleSendEmail,
    onOpenDeleteModal: handleOpenDeleteModal,
  })

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <TableSkeleton />
      </div>
    )
  }

  // Error State
  if (isError) {
    return (
      <ErrorState
        title="Failed to load subscribers"
        message="Please try again later or check your network connection."
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="py-6">
      {/* Broadcast Button */}
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowBroadcastModal(true)}
          className="px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors bg-red-600 hover:bg-red-600/60 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Broadcast to All Subscribers
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data.subscribers || []}
        pagination={
          data?.data.pagination
            ? {
                page: currentPage,
                pageSize: data.data.pagination.limit,
                total: data.data.pagination.total,
                onPageChange: setCurrentPage,
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Subscriber"
        description={`Are you sure you want to delete ${subscriberToDelete?.email}? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          accessToken={accessToken}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}

      {/* Specific Email Modal */}
      {showSpecificModal && selectedSubscriber && (
        <SpecificEmailModal
          accessToken={accessToken}
          subscriber={selectedSubscriber}
          onClose={() => {
            setShowSpecificModal(false)
            setSelectedSubscriber(null)
          }}
        />
      )}
    </div>
  )
}
