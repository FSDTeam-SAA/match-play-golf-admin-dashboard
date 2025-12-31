// 📄 src/app/admin-dashboard/subscriber-management/columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Trash2, Mail } from 'lucide-react'
import type { Subscriber } from '@/../types/subscriber'

interface ColumnActions {
  onSendEmail: (subscriber: Subscriber) => void
  onOpenDeleteModal: (subscriber: Subscriber) => void
}

export const createColumns = ({
  onSendEmail,
  onOpenDeleteModal,
}: ColumnActions): ColumnDef<Subscriber>[] => [
  {
    accessorKey: 'email',
    header: 'Email Address',
    cell: ({ row }) => (
      <div className="text-base text-gray-900">{row.original.email}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div className="text-base text-gray-600">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onSendEmail(row.original)}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Send Email"
        >
          <Mail className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => onOpenDeleteModal(row.original)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
        </button>
      </div>
    ),
  },
]
