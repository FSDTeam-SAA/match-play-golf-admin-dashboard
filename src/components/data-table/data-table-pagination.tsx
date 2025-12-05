// 📄 src/components/data-table/data-table-pagination.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
}

export function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: DataTablePaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between px-2 text-base">
      <div className="text-sm text-gray-600 px-5">
        {totalItems !== undefined && (
          <span className="text-base">
            Showing {(currentPage - 1) * 10 + 1} to{' '}
            {Math.min(currentPage * 10, totalItems)} of {totalItems} results
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-gray-300"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
        >
          <ChevronsLeft className="h-4 w-4 text-[#DF1020]" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-gray-300"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4 text-[#DF1020]" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <Button
              key={idx}
              variant={page === currentPage ? 'default' : 'outline'}
              className={`h-8 w-8 p-0 
                ${
                  page === currentPage
                    ? 'bg-[#DF1020] text-white'
                    : 'border-gray-300'
                }
              `}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-gray-300"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4 text-[#DF1020]" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-gray-300"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
        >
          <ChevronsRight className="h-4 w-4 text-[#DF1020]" />
        </Button>
      </div>
    </div>
  )
}
