<<<<<<< HEAD
import { ChevronLeft } from 'lucide-react'
import React from 'react'
=======
import { ChevronLeft } from "lucide-react";
import React from "react";
>>>>>>> origin/main
import Link from 'next/link'

const TournamentsHeader = () => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#181818] leading-[150%]">
<<<<<<< HEAD
          <Link href="/admin-dashboard/tournaments-management">
            <ChevronLeft className="inline mr-1 w-8 h-8" />{' '}
          </Link>{' '}
          Spring Championship 2025
=======
          <Link href="/organizer/tournaments-management"><ChevronLeft className="inline mr-1 w-8 h-8" /> </Link> Spring Championship 2025
>>>>>>> origin/main
        </h1>
        <p className="text-sm font-normal text-[#424242] leading-[150%] ml-11">
          Spring Championship 2025
        </p>
      </div>
    </div>
<<<<<<< HEAD
  )
}

export default TournamentsHeader
=======
  );
};

export default TournamentsHeader;
>>>>>>> origin/main
