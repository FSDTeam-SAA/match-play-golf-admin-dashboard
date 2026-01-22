

// import Link from "next/link";
// import { ChevronLeft } from "lucide-react";
const TournamentsHeader = ({tournamentName}:{tournamentName:string}) => {
  console.log("dd", tournamentName)

  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-3">
        <h2 className="text-2xl lg:text-3xl pl-4 font-bold text-[#181818] leading-[150%]">
          Tournament Name : {tournamentName || "N/A"}
        </h2>
        {/* <h1 className="text-2xl lg:text-3xl font-bold text-[#181818] leading-[150%]">
          <Link href="/organizer/tournaments-management">
          <ChevronLeft className="inline mr-1 w-8 h-8" />
           </Link> {tournamentName || "N/A"}
        </h1> */}
        {/* <p className="text-sm font-normal text-[#424242] leading-[150%] ml-11">
          Manage and edit your tournament
        </p> */}
      </div>
    </div>
  );
};

export default TournamentsHeader;
