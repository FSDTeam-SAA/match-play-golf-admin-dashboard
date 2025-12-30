// 📄 src/components/team/delete-team-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useDeleteTeamMember } from '@/lib/teamApi'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteTeamModalProps {
  memberId: string
  memberName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTeamModal({
  memberId,
  memberName,
  open,
  onOpenChange,
}: DeleteTeamModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { mutate: deleteMember, isPending } = useDeleteTeamMember(accessToken)

  const handleDelete = () => {
    deleteMember(memberId, {
      onSuccess: () => {
        toast.success('Team member deleted successfully')
        onOpenChange(false)
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete team member')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Are You Sure?</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold">{memberName}</span> from the team?
        </DialogDescription>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
