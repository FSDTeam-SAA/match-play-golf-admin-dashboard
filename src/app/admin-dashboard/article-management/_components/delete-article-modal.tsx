// 📄 src/components/articles/delete-article-modal.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useDeleteArticle } from '@/lib/articleApi'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteArticleModalProps {
  articleId: string
  articleTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteArticleModal({
  articleId,
  articleTitle,
  open,
  onOpenChange,
}: DeleteArticleModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { mutate: deleteArticle, isPending } = useDeleteArticle(accessToken)

  const handleDelete = () => {
    deleteArticle(articleId, {
      onSuccess: () => {
        toast.success('Article deleted successfully')
        onOpenChange(false)
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete article')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Are You Sure?</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the article{' '}
          <span className="font-semibold">&quot;{articleTitle}&quot;</span>?
        </DialogDescription>
<<<<<<< HEAD
        <DialogFooter className="flex gap-5">
=======
        <DialogFooter className="flex gap-2 sm:gap-0">
>>>>>>> origin/main
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
<<<<<<< HEAD
            variant="default"
=======
            variant="destructive"
>>>>>>> origin/main
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
