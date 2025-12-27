// 📄 src/components/articles/article-form-modal.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCreateArticle, useUpdateArticle } from '@/lib/articleApi'
import { Article } from '@/../types/article'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import TiptapEditor from './tiptapEditor'

interface ArticleFormModalProps {
  mode: 'create' | 'edit'
  article?: Article
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ARTICLE_TYPES = [
  'Golf Ball',
  'Golf Club',
  'Golf Course',
  'Tournament',
  'Training',
  'Equipment',
  'Draft',
]

export function ArticleFormModal({
  mode,
  article,
  open,
  onOpenChange,
}: ArticleFormModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Golf Ball',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const { mutate: createArticle, isPending: isCreating } =
    useCreateArticle(accessToken)
  const { mutate: updateArticle, isPending: isUpdating } =
    useUpdateArticle(accessToken)

  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (mode === 'edit' && article) {
      setFormData({
        title: article.title,
        description: article.description,
        type: article.type,
      })
      setImagePreview(article.coverImage)
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'Golf Ball',
      })
      setImagePreview('')
    }
    setImageFile(null)
  }, [mode, article, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'create') {
      if (!imageFile) {
        toast.error('Please select a cover image')
        return
      }
      createArticle(
        { ...formData, coverImage: imageFile },
        {
          onSuccess: () => {
            toast.success('Article created successfully')
            onOpenChange(false)
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to create article')
          },
        },
      )
    } else if (mode === 'edit' && article) {
      updateArticle(
        {
          articleId: article._id,
          data: {
            ...formData,
            coverImage: imageFile || article.coverImage,
          },
        },
        {
          onSuccess: () => {
            toast.success('Article updated successfully')
            onOpenChange(false)
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to update article')
          },
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: '50vw', maxWidth: '55vw' }}
        className="max-h-[90vh] bg-gray-50 overflow-y-auto p-6 space-y-6"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Create Article' : 'Edit Article'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Example Entry | Golfer Should Use to Build through and Power"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {ARTICLE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <TiptapEditor
              content={formData.description}
              onChange={content =>
                setFormData({ ...formData, description: content })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label htmlFor="coverImage">Image Upload</Label>

            <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById('coverImage')?.click()
                    }
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop file here
                  </p>
                  <p className="text-xs text-gray-400">or click to browse</p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById('coverImage')?.click()
                    }
                  >
                    Browse
                  </Button>
                </div>
              )}

              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Add'
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
