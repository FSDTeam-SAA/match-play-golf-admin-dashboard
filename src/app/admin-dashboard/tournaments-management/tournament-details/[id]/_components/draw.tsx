"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import MomentsModal from "./moments-modal";
import VsModal from "./vs-modal";
import PairCard from "./pair-card";
import EnterResultModal from "./enter-result-modal";

interface PairId {
  _id: string;
  tournamentId: string;
  teamName: string;
  player1: {
    _id: string;
    fullName: string;
    email: string;
    profileImage: string;
    clubName?: string;
  };
  player2: {
    _id: string;
    fullName: string;
    email: string;
    profileImage: string;
    clubName?: string;
  };
}

export interface Match {
  _id: string;
  winnerColor?: string;
  winner?: string;
  matchType: "Single" | "Pairs" | "Team";
  player1Id: {
    _id: string;
    fullName: string;
    profileImage: string;
    email: string;
    teamName?: string;
    clubName?: string;
    captainName?: string;
  };
  player2Id: {
    _id: string;
    fullName: string;
    profileImage: string;
    email: string;
    teamName?: string;
    clubName?: string;
    captainName?: string;
  };
  player1Score: string | number;
  player2Score: string | number;
  pair1Score: string | number;
  pair2Score: string | number;
  date: string | null;
  status: string;
  pair1Id?: PairId | null;
  pair2Id?: PairId | null;
  comments?: string;
  matchPhoto: string[];
  venue?: string;
  tournamentId?: string;
  knockoutStageId?: string;
  matchNumber?: number;
  round?: number;
  winnerModel?: string;
  createdBy?: string;
  verifyToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  matches?: Match[];
  isLoading: boolean;
  refetchMatches?: () => void;
  roundNumber?: number;
  setRoundNumber?: (round: number) => void;
}

const Draw = ({ matches = [], isLoading, refetchMatches }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVsModalOpen, setIsVsModalOpen] = useState(false);
  const [isEnterResultModalOpen, setIsEnterResultModalOpen] = useState(false);
  const [matchInfo, setMatchInfo] = useState<Match | null>(null);
  const [winner1, setWinner1] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenModal = (match: Match, winner1: boolean) => {
    setIsModalOpen(true);
    setMatchInfo(match);
    setWinner1(winner1);
  };

  const handleVsOpen = (match: Match) => {
    setIsVsModalOpen(true);
    setMatchInfo(match);
  };

  const handleEnterResultOpen = (match: Match, editMode: boolean = false) => {
    setIsEnterResultModalOpen(true);
    setMatchInfo(match);
    setIsEditMode(editMode);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVsCloseModal = () => {
    setIsVsModalOpen(false);
  };

  const handleEnterResultClose = () => {
    setIsEnterResultModalOpen(false);
    setIsEditMode(false);
  };

  const handleResultSuccess = () => {
    refetchMatches?.();
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start gap-5 space-y-8">
            <Skeleton className="h-6 w-8 rounded-md" />
            <div className="flex-1 shadow-lg rounded-lg overflow-hidden ">
              <div className="pl-4 pr-4 border-b border-b-gray-300 flex items-center">
                <div className="border-r border-gray-300 lg:w-1/2 p-5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>

                <div className="px-8">
                  <Skeleton className="h-6 w-8" />
                </div>

                <div className="border-l border-gray-300 lg:w-1/2 flex justify-end p-5">
                  <div className="flex items-center gap-2">
                    <div className="space-y-2 text-right">
                      <Skeleton className="h-4 w-32 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="bg-[#f9fafb] p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-20 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 text-lg">No matches found</div>
        <p className="text-gray-400 mt-2">Create a match to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {matches.map((item, index) => {
        const winner1 = item?.winner === item?.player1Id?._id;
        const winner2 = item?.winner === item?.player2Id?._id;
        const player1DisplayName =
          item.matchType === "Team"
            ? item.player1Id?.teamName
            : item.player1Id?.fullName;
        const player2DisplayName =
          item.matchType === "Team"
            ? item.player2Id?.teamName
            : item.player2Id?.fullName;

        return (
          <div key={item._id}>
            {item?.matchType === "Single" || item?.matchType === "Team" ? (
              <div className="flex items-center gap-5 space-y-5">
                <div className="font-medium text-gray-500 pt-5">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </div>

                <div className="flex-1 shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <div className="border-b border-b-gray-300 flex items-center">
                    {/* winner 1 card */}
                    <div
                      className={`border-r border-gray-300 lg:w-1/2 p-6 ${
                        winner1 ? `bg-[#39674b] text-white` : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                          {item.player1Id?.profileImage ? (
                            <Image
                              src={item.player1Id.profileImage}
                              alt={player1DisplayName || "Player 1"}
                              width={1000}
                              height={1000}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-red-800">
                              {player1DisplayName?.charAt(0) || "P1"}
                            </span>
                          )}
                        </div>
                        <div>
                          <h1 className="font-semibold">
                            {player1DisplayName || "N/A"}
                          </h1>
                        </div>
                      </div>
                    </div>

                    {/* vs button */}
                    <div
                      className={`px-8 flex items-center gap-2 ${
                        winner1 && "flex-row-reverse"
                      }`}
                    >
                      <div
                        onClick={() => handleVsOpen(item)}
                        className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                      >
                        VS
                      </div>
                      {item.status === "completed" && (
                        <div className="text-sm font-medium text-gray-600">
                          <span className="text-red-700 font-bold text-xl flex">
                            <span>{item.player1Score}</span> <span> & </span>{" "}
                            <span> {item.player2Score}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* winner 2 card */}
                    <div
                      className={`border-l border-gray-300 lg:w-1/2 flex justify-end p-6 ${
                        winner2 && `bg-[#39674b] text-white`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <h1 className="font-semibold">
                            {player2DisplayName || "N/A"}
                          </h1>
                        </div>
                        <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                          {item.player2Id?.profileImage ? (
                            <Image
                              src={item.player2Id.profileImage}
                              alt={player2DisplayName || "Player 2"}
                              width={1000}
                              height={1000}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-red-800">
                              {player2DisplayName?.charAt(0) || "P2"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#eaeaeecb] py-2 px-4">
                    <div
                      className={`flex flex-col sm:flex-row ${
                        item.status === "completed"
                          ? "justify-between"
                          : "justify-center"
                      } items-start sm:items-center gap-4`}
                    >
                      {/* Left side - Player 1 Club */}
                      <div className="min-w-[100px]">
                        <p className="truncate text-sm">
                          {item.player1Id?.clubName || "No club assigned"}
                        </p>
                      </div>

                      {/* Center - Date & Status */}
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <span className="text-gray-700 text-sm">
                            {item?.date
                              ? new Date(item?.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "Date not set"}
                          </span>
                          {/* <span>, </span>
                          <span className="text-gray-700 text-sm">
                            {item?.date
                              ? new Date(item?.date).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : ""}
                          </span> */}
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                          <div
                            className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status || "upcoming"}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Player 2 Club & Action Buttons */}
                      <div className="flex items-center gap-3 min-w-[150px] justify-end">
                        <div className="text-right">
                          <p className="text-sm truncate">
                            {item.player2Id?.clubName || "No club assigned"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.status === "completed" ||
                          item.status === "Completed" ? (
                            <>
                              <button
                                onClick={() => handleOpenModal(item, winner1)}
                                className="text-primary font-semibold text-sm hover:text-red-700 transition-colors"
                              >
                                Moments
                              </button>
                              <button
                                onClick={() =>
                                  handleEnterResultOpen(item, true)
                                }
                                className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                              >
                                Edit Result
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEnterResultOpen(item, false)}
                              className="text-primary font-semibold text-sm hover:text-red-700 transition-colors"
                            >
                              Enter Result
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // pair card
              <PairCard
                item={item as Match}
                getStatusColor={getStatusColor}
                index={index}
                refetchMatches={refetchMatches}
              />
            )}
          </div>
        );
      })}

      {isModalOpen && matchInfo && (
        <MomentsModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          match={matchInfo}
          winner1={winner1}
        />
      )}

      {isVsModalOpen && matchInfo && (
        <VsModal
          isModalOpen={isVsModalOpen}
          handleCloseModal={handleVsCloseModal}
          matchInfo={matchInfo}
        />
      )}

      {isEnterResultModalOpen && matchInfo && (
        <EnterResultModal
          isOpen={isEnterResultModalOpen}
          onClose={handleEnterResultClose}
          match={matchInfo}
          onSuccess={handleResultSuccess}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

// Helper function for status styling
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "in progress":
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default Draw;
