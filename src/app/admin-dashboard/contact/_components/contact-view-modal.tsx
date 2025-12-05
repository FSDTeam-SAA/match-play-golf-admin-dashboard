// src/components/contacts/contact-view-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useGetSingleContact } from '@/lib/contactApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

interface ContactViewModalProps {
  contactId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactViewModal({
  contactId,
  open,
  onOpenChange,
}: ContactViewModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading } = useGetSingleContact(
    open ? contactId : undefined,
    accessToken,
  )

  const contact = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : contact ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1">
                  {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Message</p>
              <p className="mt-1 text-sm">{contact.message}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Consent</p>
              <p className="mt-1">{contact.consent ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ) : (
          <p>Contact not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
