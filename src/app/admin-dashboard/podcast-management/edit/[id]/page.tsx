'use client'

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useGetSinglePodcast, useUpdatePodcast } from '@/lib/podcastApi'

import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import PodcastForm, { PodcastFormData } from '../../_components/podcastForm'

export default function EditPodcastPage() {
  const router = useRouter()
  const params = useParams()
  const podcastId = params.id as string

  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  const { data: podcastData, isLoading: isLoadingPodcast } =
    useGetSinglePodcast(podcastId, accessToken)
  const { mutate: updatePodcast, isPending } = useUpdatePodcast(accessToken)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [session.status, router])

  const handleSubmit = (data: PodcastFormData, file?: File) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('mediaName', data.mediaName)
    formData.append('linkName', data.linkName)
    formData.append('linkUrl', data.linkUrl)
    formData.append('description', data.description)

    if (file) {
      formData.append('uploadThumbnail', file)
    }

    updatePodcast(
      { podcastId, data: formData },
      {
        onSuccess: () => {
          toast.success('Podcast updated successfully!')
          router.push('/admin-dashboard/podcast-management')
        },
        onError: (error) => {
          console.error('Error updating podcast:', error)
          toast.error('Failed to update podcast. Please try again.')
        },
      }
    )
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoadingPodcast) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading podcast...</p>
        </div>
      </div>
    )
  }

  if (!podcastData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Podcast Not Found
            </div>
            <p className="text-gray-600 mb-4">
              The podcast you&apos;re trying to edit doesn&apos;t exist.
            </p>
            <Button
              onClick={() => router.push('/admin-dashboard/podcast-management')}
            >
              Back to Podcasts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#5A8DEE]">Edit Podcast</h1>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 flex items-center gap-2"
            disabled={isPending}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Podcasts
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-500">
              Edit Podcast Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PodcastForm
              podcast={podcastData.data}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
