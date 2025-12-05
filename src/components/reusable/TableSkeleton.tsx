// -------------------
// Skeleton Loader
// -------------------
export default function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-3 bg-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t">
                {Array.from({ length: 10 }).map((_, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
