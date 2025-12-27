"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React from "react";
import { Match } from "./draw";
import Image from "next/image";

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  match: Match;
  pairWinner1?: boolean;
  winner1?: boolean;
}

const MomentsModal = ({
  isModalOpen,
  handleCloseModal,
  match,
  pairWinner1,
  winner1,
}: Props) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white lg:max-w-2xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Match Play Moments
          </h1>

          <div className="mb-2 font-semibold">
            {match?.matchType === "Pair" ? (
              <div className="flex items-center gap-4">
                <h1>
                  {match?.pair1Id?.player1?.fullName} &{" "}
                  {match?.pair1Id?.player1?.fullName}
                </h1>

                <div
                  className={`flex items-center gap-2 ${
                    pairWinner1 && "flex-row-reverse"
                  }`}
                >
                  <h1>VS</h1>{" "}
                  <h1>
                    {match?.pair1Score}/{match?.pair2Score}
                  </h1>
                </div>

                <h1>
                  {match?.pair2Id?.player1?.fullName} &{" "}
                  {match?.pair2Id?.player1?.fullName}
                </h1>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <h1>{match?.player1Id?.fullName}</h1>

                <div
                  className={`flex items-center gap-2 ${
                    winner1 && "flex-row-reverse"
                  }`}
                >
                  <h1>VS</h1>{" "}
                  <h1>
                    {match?.player1Score}/{match?.player2Score}
                  </h1>
                </div>

                <h1>{match?.player2Id?.fullName}</h1>
              </div>
            )}
          </div>

          <div className="mb-5">
            <p className="opacity-75">{match?.comments || "No comments."}</p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {match?.matchPhoto?.map((item, index) => (
              <Image
                key={index}
                src={item}
                alt="img.png"
                width={1000}
                height={1000}
                className="h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MomentsModal;
