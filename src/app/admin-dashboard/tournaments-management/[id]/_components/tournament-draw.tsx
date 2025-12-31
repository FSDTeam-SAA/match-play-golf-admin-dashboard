<<<<<<< HEAD
import React from 'react'
import { Button } from "@/components/ui/button"

const TournamentDrawPage = () => {
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { TournamentResponseData } from "./single-tournament-data-type"
import { toast } from "sonner";

const TournamentDrawPage = ({ data }: { data: TournamentResponseData }) => {
    const tournamentId = (data as unknown as {_id:string})?._id;
 const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmails = async () => {
    if (!tournamentId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ action: "sendParticipantInvites" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setSuccess(true);
      toast.success("Emails sent successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

>>>>>>> origin/main
  return (
    <div>
      <h3 className="text-lg md:text-xl lg:text-2xl text-[#181818] font-bold leading-[150%]">Create Draw</h3>
      <ul className="py-4 md:py-5 lg:py-6">
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal">You have 16 participants added out of 16 needed.</li>
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal py-3">You have 3 participants registered.</li>
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal">You have 0 of participants seeded.</li>
      </ul>

<<<<<<< HEAD
      <div className="pt-2">
          <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#343A40] hover:bg-black/60 text-[#F8F9FA] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[122px]"
              >
                Participant Invite Emails Sent
              </Button>
      </div>

       {/* Buttons */}
       <div className="flex justify-start items-center gap-4 pt-6 pb-10 md:pb-14 lg:pb-20">
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#FEECEE] hover:bg-[#FEECEE] text-[#8E938F] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[63px]"
              >
                Event Drawn
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#E6E7E6] hover:bg-gray-300 text-[#343A40] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-20"
              >
                Preview
              </Button>
              <Button
                type="submit"
                className="h-[49px] bg-[#E5102E]
            hover:bg-red-700
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-[57px]"
              >
                Event Started
              </Button>
            </div>

            <div className="flex justify-start items-center gap-6 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-[49px] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[81px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#FEECEE] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[88px]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-6"
              >
                Update Even (Active)
              </Button>
            </div>
=======
      {/* <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="h-[49px] bg-[#343A40] hover:bg-black/60 text-[#F8F9FA] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[122px]"
        >
          Participant Invite Emails Sent
        </Button>
      </div> */}

           <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="h-[49px] bg-[#343A40] hover:bg-black/60 text-[#F8F9FA] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[122px]"
          onClick={handleSendEmails}
          disabled={loading}
        >
          {loading ? "Sending..." : success ? "Emails Sent!" : "Participant Invite Emails Sent"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-start items-center gap-4 pt-6 pb-10 md:pb-14 lg:pb-20">
        <Button
          type="button"
          variant="outline"
          className="h-[49px] bg-[#FEECEE] hover:bg-[#FEECEE] text-[#8E938F] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[63px]"
        >
          Event Drawn
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-[49px] bg-[#E6E7E6] hover:bg-gray-300 text-[#343A40] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-20"
        >
          Preview
        </Button>
        <Button
          type="submit"
          className="h-[49px] bg-[#E5102E]
            hover:bg-red-700
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-[57px]"
        >
          Event Started
        </Button>
      </div>

      {/* <div className="flex justify-start items-center gap-6 pt-6">
        <Button
          type="button"
          variant="outline"
          className="h-[49px] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[81px]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-[49px] bg-[#FEECEE] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[88px]"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-6"
        >
          Update Even (Active)
        </Button>
      </div> */}

>>>>>>> origin/main
    </div>
  )
}

export default TournamentDrawPage