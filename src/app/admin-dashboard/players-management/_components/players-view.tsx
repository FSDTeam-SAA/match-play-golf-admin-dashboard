import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TournamentPlayer } from "./players-management-data-type";
import Image from "next/image";

const PlayersView = ({
  open,
  onOpenChange,
  tournamentData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentData: TournamentPlayer | null;
}) => {
  if (!tournamentData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4">

        <div className="space-y-2">
             <p>
            <strong>Tournament Name :</strong> {tournamentData?.tournamentId?.tournamentName || "N/A"}
          </p>
          <p className="flex items-center gap-5">
            <strong>Player Profile :</strong> <Image src={tournamentData?.playerId?.profileImage || "/images/common/no-user.jpeg"} alt="Player Profile" width={50} height={50} className="w-10 h-10 object-cover rounded-[10px]"/> 
          </p>
          <p>
            <strong>Player Name :</strong> {tournamentData?.playerId?.fullName || "N/A"}
          </p>
          <p>
            <strong>Player Email :</strong> {tournamentData?.playerId?.fullName || "N/A"}
          </p>
          <p>
            <strong>Phone :</strong> {tournamentData?.playerId?.phone || "N/A"}
          </p>
          <p>
            <strong>Country :</strong> {tournamentData?.playerId?.country || "N/A"}
          </p>
           <p>
            <strong>Handicap :</strong> {tournamentData?.playerId?.handicap || "N/A"}
          </p>
          <p>
            <strong>Status :</strong> {tournamentData?.playerId?.status || "N/A"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayersView;

