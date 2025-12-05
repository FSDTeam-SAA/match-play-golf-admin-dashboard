'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ChevronRight, ExternalLink } from 'lucide-react'
import { useGetPodcasts, useDeletePodcast, Podcast } from '@/lib/podcastApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

import { useSession } from 'next-auth/react'
import PodcastTable from './podcastTable'

export default function PodcastManagement() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [viewingPodcast, setViewingPodcast] = useState<Podcast | null>(null)

  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  // API Queries
  const {
    data: podcastsData,
    isLoading: podcastsLoading,
    error: podcastsError,
    refetch,
  } = useGetPodcasts(accessToken, currentPage, 10)

  const { mutate: deletePodcast, isPending: isDeleting } =
    useDeletePodcast(accessToken)

  useEffect(() => {
    if (accessToken) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentPage])

  const handleAddPodcast = () => {
    router.push('/admin-dashboard/podcast-management/add')
  }

  const handleEditPodcast = (podcast: Podcast) => {
    router.push(`/admin-dashboard/podcast-management/edit/${podcast._id}`)
  }

  const handleViewPodcast = (podcast: Podcast) => {
    setViewingPodcast(podcast)
    setIsDetailsOpen(true)
  }

  const handleDeletePodcast = (podcastId: string) => {
    deletePodcast(podcastId, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const podcasts = podcastsData?.data?.podcasts || []
  const pagination = podcastsData?.data?.pagination

  if (podcastsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Podcasts
            </div>
            <p className="text-gray-600 mb-4">
              Failed to load podcasts. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5A8DEE]">
                Podcast Management
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-gray-900 font-medium">
                  Podcast Management
                </span>
              </div>
            </div>
            <Button
              onClick={handleAddPodcast}
              className="h-11 px-6 flex items-center gap-2"
              disabled={isDeleting || !accessToken}
              title={!accessToken ? 'Waiting for auth...' : undefined}
            >
              <Plus className="w-4 h-4" />
              Add New Podcast
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>All Podcasts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PodcastTable
              podcasts={podcasts}
              onView={handleViewPodcast}
              onEdit={handleEditPodcast}
              onDelete={handleDeletePodcast}
              isLoading={podcastsLoading || isDeleting}
              currentPage={currentPage}
              totalPages={pagination?.totalPages || 1}
              totalData={pagination?.totalData || 0}
              hasNextPage={pagination?.hasNextPage || false}
              hasPrevPage={pagination?.hasPrevPage || false}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="!max-w-4xl w-full h-[90vh] overflow-y-auto rounded-xl shadow-lg">
            {/* Sticky Header */}
            <DialogHeader className="sticky top-0 bg-white border-bpb-4">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Podcast Details
              </DialogTitle>
            </DialogHeader>

            {viewingPodcast && (
              <div className="space-y-6 py-6">
                {/* Podcast Header Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {viewingPodcast.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {viewingPodcast.mediaName}
                    </span>
                    <span className="flex items-center gap-1">
                      📅{' '}
                      {new Date(viewingPodcast.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Podcast Thumbnail */}
                {viewingPodcast.uploadThumbnail && (
                  <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={viewingPodcast.uploadThumbnail}
                      alt={viewingPodcast.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Podcast Description */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-gray-900">
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {viewingPodcast.description}
                  </p>
                </div>

                {/* External Link */}
                {viewingPodcast.linkUrl && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      External Link
                    </h4>
                    <a
                      href={viewingPodcast.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{viewingPodcast.linkName}</span>
                    </a>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">File Type</p>
                    <p className="font-medium text-gray-900">
                      {viewingPodcast.fileType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">File Size</p>
                    <p className="font-medium text-gray-900">
                      {viewingPodcast.fileSize
                        ? `${(viewingPodcast.fileSize / 1024 / 1024).toFixed(
                            2
                          )} MB`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created At</p>
                    <p className="font-medium text-gray-900">
                      {new Date(viewingPodcast.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(viewingPodcast.updatedAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
