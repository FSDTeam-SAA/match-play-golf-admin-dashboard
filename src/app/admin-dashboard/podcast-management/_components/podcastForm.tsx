'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Podcast } from '@/lib/podcastApi'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const podcastSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mediaName: z.string().min(1, 'Media name is required'),
  linkName: z.string().min(1, 'Link name is required'),
  linkUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
})

export type PodcastFormData = z.infer<typeof podcastSchema>

interface PodcastFormProps {
  podcast?: Podcast | null
  onSubmit: (data: PodcastFormData, file?: File) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function PodcastForm({
  podcast,
  onSubmit,
  onCancel,
  isLoading,
}: PodcastFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(
    podcast?.uploadThumbnail || ''
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PodcastFormData>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: podcast?.title || '',
      mediaName: podcast?.mediaName || '',
      linkName: podcast?.linkName || '',
      linkUrl: podcast?.linkUrl || '',
      description: podcast?.description || '',
    },
  })

  useEffect(() => {
    if (podcast) {
      reset({
        title: podcast.title || '',
        mediaName: podcast.mediaName || '',
        linkName: podcast.linkName || '',
        linkUrl: podcast.linkUrl || '',
        description: podcast.description || '',
      })
      setImagePreview(podcast.uploadThumbnail || '')
    }
  }, [podcast, reset])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview('')
    setImageFile(null)
  }

  const onFormSubmit = (data: PodcastFormData) => {
    onSubmit(data, imageFile || undefined)
  }

  return (
    <div className="space-y-6 text-gray-500 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title *
          </Label>
          <Input
            id="title"
            placeholder="Enter podcast title..."
            {...register('title')}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Media Name (Dropdown) */}
        <div>
          <Label
            htmlFor="mediaName"
            className="text-sm font-medium text-gray-700"
          >
            Media Name *
          </Label>
          <Select
            onValueChange={(value) => setValue('mediaName', value)}
            value={watch('mediaName')}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YouTube Videos">YouTube Videos</SelectItem>
              <SelectItem value="Spotify Audios">Spotify Audios</SelectItem>
            </SelectContent>
          </Select>
          {errors.mediaName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mediaName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Link Name */}
        <div>
          <Label
            htmlFor="linkName"
            className="text-sm font-medium text-gray-700"
          >
            Link Name *
          </Label>
          <Input
            id="linkName"
            placeholder="e.g., Listen on Spotify"
            {...register('linkName')}
            className="mt-1"
          />
          {errors.linkName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.linkName.message}
            </p>
          )}
        </div>

        {/* Link URL */}
        <div>
          <Label
            htmlFor="linkUrl"
            className="text-sm font-medium text-gray-700"
          >
            Link URL
          </Label>
          <Input
            id="linkUrl"
            placeholder="https://example.com"
            {...register('linkUrl')}
            className="mt-1"
          />
          {errors.linkUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.linkUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Enter podcast description..."
          {...register('description')}
          className="mt-1 min-h-[120px]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">
          Podcast Thumbnail
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-1 hover:border-gray-400 transition-colors">
          {imagePreview ? (
            <div className="relative inline-block">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={150}
                className="max-h-48 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mb-4">
                PNG, JPG, WEBP up to 10MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="podcast-thumbnail"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById('podcast-thumbnail')?.click()
                }
              >
                Choose File
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-start gap-3 pt-6">
        <Button
          onClick={handleSubmit(onFormSubmit)}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {podcast ? 'Updating...' : 'Creating...'}
            </>
          ) : podcast ? (
            'Update Podcast'
          ) : (
            'Create Podcast'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
