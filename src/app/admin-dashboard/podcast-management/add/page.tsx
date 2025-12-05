'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useAddPodcast } from '@/lib/podcastApi'

import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import PodcastForm, { PodcastFormData } from '../_components/podcastForm'

export default function AddPodcastPage() {
  const router = useRouter()
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  const { mutate: addPodcast, isPending } = useAddPodcast(accessToken)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [session.status, router])

  const handleSubmit = (data: PodcastFormData, file?: File) => {
    const formData = new FormData()

    // Append form fields
    formData.append('title', data.title)
    formData.append('mediaName', data.mediaName)
    formData.append('linkName', data.linkName)
    formData.append('linkUrl', data.linkUrl)
    formData.append('description', data.description)

    // Append file if it exists
    if (file) {
      formData.append('uploadThumbnail', file)
    }

    addPodcast(formData, {
      onSuccess: () => {
        toast.success('Podcast added successfully!')
        router.push('/admin-dashboard/podcast-management')
      },
      onError: (error) => {
        console.error('Error adding podcast:', error)
        toast.error('Failed to add podcast. Please try again.')
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#5A8DEE]">
              Add New Podcast
            </h1>

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
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-500">Podcast Information</CardTitle>
          </CardHeader>
          <CardContent className="bg-transparent">
            <PodcastForm
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
