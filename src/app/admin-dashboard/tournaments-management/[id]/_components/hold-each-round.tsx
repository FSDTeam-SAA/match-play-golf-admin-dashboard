"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface HoldEachRoundToggleProps {
  tournamentId: string;
  defaultValue?: boolean;
}

const HoldEachRoundToggle = ({
  tournamentId,
  defaultValue = false,
}: HoldEachRoundToggleProps) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { mutate, isPending } = useMutation({
    mutationKey: ["hold-round", tournamentId],
    mutationFn: async (onHold: boolean) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}/hold`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ onHold }),
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to update hold status");
        return;
      }
      toast.success("Hold status updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="mt-10 rounded-xl border border-[#E5E7EB] p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="holdEachRound"
          defaultChecked={defaultValue}
          disabled={isPending}
          onCheckedChange={(checked) => mutate(Boolean(checked))}
          className="mt-1"
        />

        <label htmlFor="holdEachRound" className="cursor-pointer">
          <h4 className="text-base md:text-lg font-semibold text-[#131313]">
            Hold Each Round
          </h4>
          <p className="text-sm md:text-base text-[#424242] leading-[150%] pt-1">
            If checked, the next round of matches will not be displayed until the current round has been completed.
          </p>
        </label>
      </div>
    </div>
  );
};

export default HoldEachRoundToggle;
