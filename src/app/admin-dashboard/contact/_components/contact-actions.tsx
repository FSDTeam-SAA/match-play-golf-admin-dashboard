// src/components/contacts/contact-actions.tsx

'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Contact } from '@/../types/contact'
import { ContactViewModal } from './contact-view-modal'
import { DeleteContactModal } from './delete-contact-modal'

interface ContactActionsProps {
  contact: Contact
}

export function ContactActions({ contact }: ContactActionsProps) {
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewOpen(true)}
          className="h-10 w-10"
        >
          <Eye size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="h-10 w-10 text-red-600 hover:text-red-700"
        >
          <Trash2 size={20} />
        </Button>
      </div>

      <ContactViewModal
        contactId={contact._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <DeleteContactModal
        contactId={contact._id}
        contactName={contact.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
