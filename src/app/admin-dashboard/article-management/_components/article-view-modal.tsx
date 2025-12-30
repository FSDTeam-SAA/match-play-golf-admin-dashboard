// 📄 src/components/articles/article-view-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useGetSingleArticle } from '@/lib/articleApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface ArticleViewModalProps {
  articleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArticleViewModal({
  articleId,
  open,
  onOpenChange,
}: ArticleViewModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken ?? ''

  const { data, isLoading } = useGetSingleArticle(
    open ? articleId : undefined,
    accessToken,
  )

  const article = data?.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : article ? (
          <div className="space-y-6">
            {/* Cover Image */}
            {article?.coverImage && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={article?.coverImage}
                  alt={article?.title ?? 'Article cover'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title and Type */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  {article?.title ?? 'Untitled Article'}
                </h2>
                {article?.type && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {article?.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {article?.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: article?.description ?? '',
                  }}
                />
              </div>
            )}

            {/* Created By */}
            <div className="flex items-center gap-3 pt-4 border-t">
              {article?.createdBy?.profileImage && (
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={article?.createdBy?.profileImage}
                    alt={article?.createdBy?.fullName ?? 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <p className="font-medium">
                  {article?.createdBy?.fullName ?? 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-500">
                  {article?.createdBy?.role ?? 'Role unknown'}
                  {article?.createdAt && (
                    <>
                      {' '}
                      • {format(new Date(article?.createdAt), 'MMM dd, yyyy')}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Article not found</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
