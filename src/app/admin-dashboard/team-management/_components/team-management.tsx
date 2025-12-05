// 📄 src/app/(dashboard)/team-management/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetTeamMembers } from '@/lib/teamApi'
import { DataTable } from '@/components/data-table/data-table'
import { teamColumns } from './team-columns'
import { TeamFormModal } from './team-form-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorState from '@/components/reusable/ErrorState'

export default function TeamManagementPage() {
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading, isError } = useGetTeamMembers(accessToken)

  if (isLoading) {
    return <TableSkeleton />
  }

  // Error State
  if (isError) {
    return (
      <ErrorState
        title="Failed to load articles"
        message="Please try again later or check your network connection."
        onRetry={() => window.location.reload()}
      />
    )
  }
  return (
    <div className="container mx-auto py-5">
      <div className="mb-6 flex items-center justify-end">
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <DataTable
        columns={teamColumns}
        data={data?.data || []}
        pagination={{
          page,
          pageSize: 10,
          total: data?.pagination.total || 0,
          onPageChange: setPage,
        }}
      />

      <TeamFormModal mode="create" open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
