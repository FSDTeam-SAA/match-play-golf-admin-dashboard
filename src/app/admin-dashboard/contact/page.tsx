// 📄 src/app/(dashboard)/contacts/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetContacts } from '@/lib/contactApi'
import { DataTable } from '@/components/data-table/data-table'
import { contactColumns } from './_components/contact-column'
import { Loader2 } from 'lucide-react'

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading } = useGetContacts(accessToken, page, 10)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-5">
      {/* <div className="mb-6">
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <p className="text-muted-foreground">
          View and manage all contact requests
        </p>
      </div> */}

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
