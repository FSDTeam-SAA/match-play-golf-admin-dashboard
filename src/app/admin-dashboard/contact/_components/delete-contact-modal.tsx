// 📄 src/components/contacts/delete-contact-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useDeleteContact } from '@/lib/contactApi'
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

interface DeleteContactModalProps {
  contactId: string
  contactName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteContactModal({
  contactId,
  contactName,
  open,
  onOpenChange,
}: DeleteContactModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { mutate: deleteContact, isPending } = useDeleteContact(accessToken)

  const handleDelete = () => {
    deleteContact(contactId, {
      onSuccess: () => {
        toast.success('Contact deleted successfully')
        onOpenChange(false)
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete contact')
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
          Are you sure you want to delete contact from{' '}
          <span className="font-semibold">{contactName}</span>?
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
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
