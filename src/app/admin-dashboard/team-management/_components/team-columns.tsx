// 📄 src/components/team/team-columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { TeamMember } from '@/../types/team'
import { TeamActions } from './team-actions'
import Image from 'next/image'

export const teamColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'image',
    header: 'Member',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string
      const name = row.getValue('memberName') as string

      return (
        <div className="flex items-center justify-center gap-4">
          {/* Image */}
          <div className="h-12 w-12 relative rounded-full overflow-hidden">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
          </div>

          {/* Name */}
          <span className="font-medium truncate max-w-[180px]" title={name}>
            {name}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'designation',
    header: 'Designation',
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return (
        <div className="flex justify-center">
          <div className="max-w-[400px] truncate" title={description}>
            {description}
          </div>
        </div>
      )
    },
  },

  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <TeamActions member={row.original} />,
  },
]
