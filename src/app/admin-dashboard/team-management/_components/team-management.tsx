// 📄 src/app/(dashboard)/team-management/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetTeamMembers } from '@/lib/teamApi'
import { DataTable } from '@/components/data-table/data-table'
import { teamColumns } from './team-columns'
import { TeamFormModal } from './team-form-modal'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'

export default function TeamManagementPage() {
  const [addOpen, setAddOpen] = useState(false)
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading } = useGetTeamMembers(accessToken)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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

      <DataTable columns={teamColumns} data={data?.data || []} />

      <TeamFormModal mode="create" open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
