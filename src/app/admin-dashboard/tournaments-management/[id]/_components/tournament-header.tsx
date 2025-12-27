import { ChevronLeft } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const TournamentsHeader = () => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#181818] leading-[150%]">
          <Link href="/admin-dashboard/tournaments-management">
            <ChevronLeft className="inline mr-1 w-8 h-8" />{' '}
          </Link>{' '}
          Spring Championship 2025
        </h1>
        <p className="text-sm font-normal text-[#424242] leading-[150%] ml-11">
          Spring Championship 2025
        </p>
      </div>
    </div>
  )
}

export default TournamentsHeader
