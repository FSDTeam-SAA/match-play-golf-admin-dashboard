// ==================== FILE: _components/ProfileImageUpload.tsx ====================
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Camera } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ProfileImageUploadProps {
  imagePreview: string
  fullName: string
  isUpdating: boolean
  onImageChange: (file: File) => void
  onUpload: () => void
}

export function ProfileImageUpload({
  imagePreview,
  fullName,
  isUpdating,
  onImageChange,
  onUpload,
}: ProfileImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB')
      return
    }

    onImageChange(file)
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
              {fullName.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <label
          htmlFor="profile-image"
          className="absolute bottom-0 right-0 bg-[#DF1020] text-white p-2 rounded-full cursor-pointer hover:bg-[#DF1020]/80 transition-colors shadow-lg"
        >
          <Camera className="w-4 h-4" />
        </label>
        <input
          type="file"
          id="profile-image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Your Profile Picture</h3>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        <Button
          onClick={onUpload}
          disabled={isUpdating}
          className="mt-3 bg-[#DF1020] hover:bg-[#DF1020]/80"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </Button>
      </div>
    </div>
  )
}
