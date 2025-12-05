// 📄 src/components/team/team-form-modal.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCreateTeamMember, useUpdateTeamMember } from '@/lib/teamApi'
import { TeamMember } from '@/../types/team'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface TeamFormModalProps {
  mode: 'create' | 'edit'
  member?: TeamMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamFormModal({
  mode,
  member,
  open,
  onOpenChange,
}: TeamFormModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const [formData, setFormData] = useState({
    memberName: '',
    designation: '',
    description: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const { mutate: createMember, isPending: isCreating } =
    useCreateTeamMember(accessToken)
  const { mutate: updateMember, isPending: isUpdating } =
    useUpdateTeamMember(accessToken)

  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (mode === 'edit' && member) {
      setFormData({
        memberName: member.memberName,
        designation: member.designation,
        description: member.description,
      })
      setImagePreview(member.image)
    } else {
      setFormData({
        memberName: '',
        designation: '',
        description: '',
      })
      setImagePreview('')
    }
    setImageFile(null)
  }, [mode, member, open])

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
        toast.error('Please select an image')
        return
      }
      createMember(
        { ...formData, image: imageFile },
        {
          onSuccess: () => {
            toast.success('Team member created successfully')
            onOpenChange(false)
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to create team member')
          },
        },
      )
    } else if (mode === 'edit' && member) {
      updateMember(
        {
          memberId: member._id,
          data: {
            ...formData,
            image: imageFile || member.image,
          },
        },
        {
          onSuccess: () => {
            toast.success('Team member updated successfully')
            onOpenChange(false)
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to update team member')
          },
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Team Member' : 'Edit Team Member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memberName">Member Name</Label>
            <Input
              id="memberName"
              value={formData.memberName}
              onChange={e =>
                setFormData({ ...formData, memberName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={e =>
                setFormData({ ...formData, designation: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image Upload</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" asChild>
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
            </div>
            {imagePreview && (
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <DialogFooter>
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
