import React from "react";

const MatchesManagementHeader = () => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-6 ">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#181818] leading-[150%]">
          Matches Management
        </h1>
        <p className="text-sm font-normal text-[#424242] leading-[150%]">
          View and manage all matches
        </p>
      </div>
    </div>
  );
};

export default MatchesManagementHeader;
