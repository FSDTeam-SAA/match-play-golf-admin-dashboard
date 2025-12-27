// 📄 src/app/(dashboard)/article-management/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetArticles } from '@/lib/articleApi'
import { DataTable } from '@/components/data-table/data-table'
import { articleColumns } from './article-columns'
import { ArticleFormModal } from './article-form-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TableSkeleton from '@/components/reusable/TableSkeleton'
import ErrorState from '@/components/reusable/ErrorState'

export default function ArticleManagementPage() {
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading, isError } = useGetArticles(accessToken, page, 10)

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
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={() => setAddOpen(true)}
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Create Article
        </Button>
      </div>

      <DataTable
        columns={articleColumns}
        data={data?.data || []}
        pagination={{
          page,
          pageSize: 10,
          total: data?.pagination.total || 0,
          onPageChange: setPage,
        }}
      />

      <ArticleFormModal
        mode="create"
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  )
}
