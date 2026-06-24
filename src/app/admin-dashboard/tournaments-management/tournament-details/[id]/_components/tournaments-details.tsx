"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Rules from "./rules";
import Details from "./details";
import Draw from "./draw";
import TournamentsHeader from "../../../[id]/_components/tournament-header";
import { TournamentApiResponse, MatchesResponse } from "./tournament-types";
import { useSession } from "next-auth/react";

const TournamentsDetails = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const params = useParams();
  const id = params?.id;

  const [isActive, setIsActive] = useState("draw");
  const [roundNumber, setRoundNumber] = useState(1);

  const { data, isLoading, refetch } = useQuery<MatchesResponse>({
    queryKey: ["tournaments", roundNumber],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/getAllMatches/${id}?roundNumber=${roundNumber}`,
      );

      const data = await res.json();

      return data?.data;
    },
  });

  // get api call
  const { data: tournamentData } = useQuery<TournamentApiResponse>({
    queryKey: ["single-tournament", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return res.json();
    },
    enabled: !!token,
  });

  // Helper function to format round date
  const formatRoundDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tournamentName =
    (tournamentData &&
      tournamentData?.data &&
      tournamentData?.data?.tournament?.tournamentName) ||
    "N/A";

  return (
    <div>
      <TournamentsHeader tournamentName={tournamentName} />
      {/* sub-pages */}
      <div className="p-6">
        <div className="flex items-center gap-8 border-b-[1px] border-gray-300">
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === "draw" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("draw")}
          >
            Draw
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === "rules" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("rules")}
          >
            Rules
          </button>

          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === "details" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("details")}
          >
            Details
          </button>
        </div>

        {/* Round Filters with Dates */}
        {isActive === "draw" && data?.rounds && data.rounds.length > 0 && (
          <div className="mt-6 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-5">
              {data.rounds.map((round) => (
                <div
                  key={round._id}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    className={`h-[40px] sm:h-[45px] w-full rounded-3xl transition-all duration-200 ${
                      roundNumber === round?.roundNumber
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-inherit border border-primary text-primary hover:bg-primary/10"
                    }`}
                    onClick={() => setRoundNumber(round.roundNumber)}
                  >
                    <span className="text-xs sm:text-sm truncate">
                      {round.roundName}
                    </span>
                  </button>
                  {/* Display round date */}
                  {round.date && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatRoundDate(round.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          {isActive === "draw" && (
            <div>
              <Draw
                roundNumber={roundNumber}
                setRoundNumber={setRoundNumber}
                matches={data?.matches}
                isLoading={isLoading}
                refetchMatches={refetch}
              />
            </div>
          )}

          {isActive === "rules" && (
            <div>
              <Rules rules={data?.tournament?.rules} isLoading={isLoading} />
            </div>
          )}
          {isActive === "details" && (
            <div>
              <Details tournament={data?.tournament} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentsDetails;
