'use client'

import { AlertTriangle } from 'lucide-react'

export default function ErrorState({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>

      <h2 className="text-xl font-semibold text-red-600">{title}</h2>

      <p className="text-gray-600 max-w-md mt-2 mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
