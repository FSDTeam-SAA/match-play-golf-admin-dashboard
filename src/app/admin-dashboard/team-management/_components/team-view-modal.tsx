// 📄 src/components/team/team-view-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useGetSingleTeamMember } from '@/lib/teamApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface TeamViewModalProps {
  memberId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamViewModal({
  memberId,
  open,
  onOpenChange,
}: TeamViewModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading } = useGetSingleTeamMember(
    open ? memberId : undefined,
    accessToken,
  )

  const member = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Team Member Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : member ? (
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                <Image
                  src={member.image}
                  alt={member.memberName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-lg font-semibold">
                    {member.memberName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Designation
                  </p>
                  <p className="mt-1">{member.designation}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ) : (
          <p>Team member not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
