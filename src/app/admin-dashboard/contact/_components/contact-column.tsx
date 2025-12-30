//  src/components/contacts/contact-columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Contact } from '@/../types/contact'
import { ContactActions } from './contact-actions'
import { format } from 'date-fns'

export const contactColumns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Mail Address',
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
  },
  {
    accessorKey: 'message',
    header: 'Messages',
    cell: ({ row }) => {
      const message = row.getValue('message') as string
      return (
<<<<<<< HEAD
        <div className="flex justify-center text-lg">
=======
        <div className="flex justify-center">
>>>>>>> origin/main
          <div className="max-w-[300px] truncate " title={message}>
            {message}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return format(new Date(date), 'MMM dd, yyyy')
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ContactActions contact={row.original} />,
  },
]
