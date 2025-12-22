// 📄 src/app/(dashboard)/contacts/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetContacts } from '@/lib/contactApi'
import { DataTable } from '@/components/data-table/data-table'
import { contactColumns } from './contact-column'
import TableSkeleton from '@/components/reusable/TableSkeleton'
// import { AlertTriangle } from 'lucide-react'
import ErrorState from '@/components/reusable/ErrorState'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading, isError } = useGetContacts(accessToken, page, 10)

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <TableSkeleton />
      </div>
    )
  }

  // Error State
  if (isError) {
    return (
      <ErrorState
        title="Failed to load contacts"
        message="Please try again later or check your network connection."
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="container mx-auto py-5">
      <DataTable
        columns={contactColumns}
        data={data?.data || []}
        pagination={{
          page,
          pageSize: 10,
          total: data?.pagination.total || 0,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
