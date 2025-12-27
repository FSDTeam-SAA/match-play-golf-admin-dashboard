export default function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="h-[139px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px] animate-pulse"
        >
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
