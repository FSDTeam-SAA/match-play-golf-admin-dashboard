// 📄 src/components/articles/article-actions.tsx

'use client'

import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Article } from '@/../types/article'
import { ArticleViewModal } from './article-view-modal'
import { ArticleFormModal } from './article-form-modal'
import { DeleteArticleModal } from './delete-article-modal'

interface ArticleActionsProps {
  article: Article
}

export function ArticleActions({ article }: ArticleActionsProps) {
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewOpen(true)}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="h-8 w-8 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ArticleViewModal
        articleId={article._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <ArticleFormModal
        mode="edit"
        article={article}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteArticleModal
        articleId={article._id}
        articleTitle={article.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
