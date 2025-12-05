// -------------------
// Error UI
// -------------------
import { AlertTriangle } from 'lucide-react'

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-red-100 mb-4">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-red-600 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">{message}</p>
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

export default ErrorState
