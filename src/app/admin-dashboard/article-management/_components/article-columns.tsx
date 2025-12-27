// 📄 src/components/articles/article-columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Article } from '@/../types/article'
import { ArticleActions } from './article-actions'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export const articleColumns: ColumnDef<Article>[] = [
  // HIDDEN TITLE COLUMN — required by table internal system
  {
    accessorKey: 'title',
    header: '',
    enableHiding: true,
    cell: () => null,
  },

  // COMBINED IMAGE + TITLE COLUMN
  {
    accessorKey: 'coverImage',
    header: 'Article',
    cell: ({ row }) => {
      const imageUrl = row.getValue('coverImage') as string
      const title = row.getValue('title') as string

      return (
        <div className="flex items-center justify-center gap-4">
          {/* Image */}
          <div className="h-12 w-16 relative rounded overflow-hidden">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>

          {/* Title */}
          <div
            className="max-w-[200px] truncate font-medium text-sm"
            title={title}
          >
            {title}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      const plainText = description.replace(/<[^>]*>/g, '')
      return (
        <div className="flex justify-center">
          <div
            className="max-w-[300px] text-center text-gray-500 truncate"
            title={plainText}
          >
            {plainText}
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      const statusColor =
        type === 'Golf Ball'
          ? 'bg-green-100 text-green-800'
          : type === 'Draft'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'

      return <Badge className={statusColor}>{type}</Badge>
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColor =
        status === 'draft' ? 'text-yellow-600' : 'text-green-600'

      const text = status === 'draft' ? 'Draft' : 'Published'

      return <span className={`font-medium ${statusColor}`}>{text}</span>
    },
  },

  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ArticleActions article={row.original} />,
  },
]
