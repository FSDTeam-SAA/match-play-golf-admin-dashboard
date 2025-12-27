import Link from 'next/link'
import React from 'react'

const CreateTournamentHeader = () => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-6 ">
        <h1 className="flex items-center gap-2 text-2xl lg:text-3xl font-bold text-[#181818] leading-[150%]">
          <Link href="/admin-dashboard/tournaments-management">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#68706A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>{' '}
          Create Event
        </h1>
        <p className="text-sm font-normal text-[#424242] leading-[150%]">
          Manage all golf tournaments
        </p>
      </div>
    </div>
  )
}

export default CreateTournamentHeader
