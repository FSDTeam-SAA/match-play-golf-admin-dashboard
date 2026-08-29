"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import TableSkeleton from "@/components/reusable/TableSkeleton";
import ErrorContainer from "@/components/ErrorContainer/ErrorContainer";
import NotFound from "@/components/reusable/not-found-data";
import { TournamentPlayersRoundApiResponse } from "../../create-match/_components/round-tournament-data-type";

type MatchParticipant = {
  _id: string;
  fullName?: string;
  email?: string;
  teamName?: string;
};

type MatchPlayer = {
  _id: string;
  name?: string;
  team?: string;
  player1?: string;
  player2?: string;
};

type SelectablePlayer = {
  _id: string;
  name: string;
};

const getParticipantId = (participant: MatchParticipant | string | null | undefined) => {
  if (!participant) return "";
  if (typeof participant === "string") return participant;
  return participant._id || "";
};

const getParticipantDisplayName = (
  participant: MatchParticipant | string | null | undefined,
) => {
  if (!participant || typeof participant === "string") return "";
  return (
    participant.fullName?.trim() ||
    participant.teamName?.trim() ||
    participant.email?.trim() ||
    ""
  );
};

type SingleMatchResponse = {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    tournamentId: {
      _id: string;
      tournamentName: string;
      sportName: string;
      format: string;
      startDate: Date;
      endDate: Date;
    };
    round: number;
    matchNumber: number;
    matchType: string;
    player1Id: MatchParticipant | null;
    player2Id: MatchParticipant | null;
    pair1Id: MatchParticipant | null;
    pair2Id: MatchParticipant | null;
    date: string | null;
    venue?: string;
    status: string;
  };
  players: MatchPlayer[];
  rounds?: {
    _id: string;
    roundName: string;
    roundNumber: number;
    date: string;
  }[];
};

const ALLOWED_STATUSES = [
  "pending",
  "scheduled",
  "in-progress",
  "completed",
  "rescheduled",
] as const;

const formSchema = z.object({
  date: z.date().nullable(),
  venue: z.string().min(1, "Venue is required"),
  status: z.enum(ALLOWED_STATUSES, { message: "Match status is required" }),
  player1Id: z.string().min(1, "Player / Pair 1 is required"),
  player2Id: z.string().min(1, "Player / Pair 2 is required"),
}).refine((data) => data.player1Id !== data.player2Id, {
  message: "Player / Pair 1 and Player / Pair 2 cannot be the same",
  path: ["player2Id"],
});

const normalizeStatus = (
  status?: string,
): (typeof ALLOWED_STATUSES)[number] => {
  const value = status?.trim().toLowerCase();

  if (!value) return "scheduled";
  if (value === "ongoing" || value === "in progress") return "in-progress";
  if (value === "upcoming") return "scheduled";
  if (value === "cancelled") return "rescheduled"; // legacy fallback

  if (ALLOWED_STATUSES.includes(value as (typeof ALLOWED_STATUSES)[number])) {
    return value as (typeof ALLOWED_STATUSES)[number];
  }

  return "scheduled";
};

const EditMatchForm = () => {
  const params = useParams();
  const matchId = params?.id as string;
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const {
    data: matchData,
    isLoading,
    isError,
    error,
  } = useQuery<SingleMatchResponse>({
    queryKey: ["single-match-edit", matchId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/${matchId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.json();
    },
    enabled: !!matchId && !!token,
  });
  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorContainer
          message={(error as Error)?.message || "Something went wrong"}
        />
      </div>
    );
  }

  if (!matchData?.success || !matchData?.data) {
    return (
      <div className="p-6">
        <NotFound message="Match not found" />
      </div>
    );
  }

  return <EditMatchFormInner matchData={matchData} matchId={matchId} token={token} />;
};

const EditMatchFormInner = ({ matchData, matchId, token }: { matchData: SingleMatchResponse, matchId: string, token: string | undefined }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const match = matchData?.data;

  const players = matchData?.players ?? [];
  // const isPairs = match?.matchType === "Pairs";

  const selectablePlayers = useMemo<SelectablePlayer[]>(() => {
    const options = new Map<string, SelectablePlayer>();

    // Map players from the API response — handles both Single (name) and Pairs (team) formats
    players.forEach((player) => {
      const displayName = player.name || player.team || "Unknown";
      options.set(player._id, { _id: player._id, name: displayName });
    });

    // Ensure the currently assigned participants are always in the list
    // (in case they're somehow missing from the players array)
    const player1 = match?.player1Id ?? match?.pair1Id;
    const player2 = match?.player2Id ?? match?.pair2Id;

    [player1, player2].forEach((participant) => {
      const participantId = getParticipantId(participant);
      if (!participantId) return;

      if (!options.has(participantId)) {
        const fallbackName = getParticipantDisplayName(participant) || "Selected participant";
        options.set(participantId, {
          _id: participantId,
          name: fallbackName,
        });
      }
    });

    return Array.from(options.values());
  }, [players, match?.player1Id, match?.pair1Id, match?.player2Id, match?.pair2Id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: match?.date ? new Date(match?.date) : null,
      venue: match?.venue || "",
      status: normalizeStatus(match?.status),
      player1Id: getParticipantId(match?.player1Id ?? match?.pair1Id),
      player2Id: getParticipantId(match?.player2Id ?? match?.pair2Id),
    },
  });

  const { data: tournamentDetails } =
    useQuery<TournamentPlayersRoundApiResponse>({
      queryKey: ["tournament-details-for-edit", match?.tournamentId?._id],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/findplayer/${match?.tournamentId?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return res.json();
      },
      enabled: !!match?.tournamentId?._id && !!token,
    });

  const matchRounds = useMemo(() => {
    return (matchData?.rounds || tournamentDetails?.rounds || [])
      .slice()
      .sort((a, b) => a.roundNumber - b.roundNumber);
  }, [matchData?.rounds, tournamentDetails?.rounds]);

  const { minDate, maxDate } = useMemo(() => {
    if (!match) return { minDate: undefined, maxDate: undefined };
    
    const tournamentStartDate = match.tournamentId?.startDate ? new Date(match.tournamentId.startDate) : undefined;
    const tournamentEndDate = match.tournamentId?.endDate ? new Date(match.tournamentId.endDate) : undefined;

    const currentRoundIndex = matchRounds.findIndex((r) => r.roundNumber === match.round);
    
    let min: Date | undefined = undefined;
    let max: Date | undefined = undefined;

    if (currentRoundIndex === 0) {
      min = tournamentStartDate;
      max = new Date(matchRounds[0].date);
    } else if (currentRoundIndex > 0) {
      min = new Date(matchRounds[currentRoundIndex - 1].date);
      max = new Date(matchRounds[currentRoundIndex].date);
    } else {
      min = tournamentStartDate;
      max = tournamentEndDate;
    }

    if (min) min.setHours(0, 0, 0, 0);
    if (max) max.setHours(0, 0, 0, 0);

    return { minDate: min, maxDate: max };
  }, [match, matchRounds]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-match", matchId],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const isPairsMatch = match?.matchType === "Pairs";
      const payload: Record<string, string | null> = {
        date:
          values.date instanceof Date
            ? format(values.date, "yyyy-MM-dd")
            : values.date,
        venue: values.venue,
        status: values.status,
      };

      if (isPairsMatch) {
        payload.pair1Id = values.player1Id;
        payload.pair2Id = values.player2Id;
      } else {
        payload.player1Id = values.player1Id;
        payload.player2Id = values.player2Id;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/${matchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "Match updated successfully");
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["single-match", matchId] });
      queryClient.invalidateQueries({
        queryKey: ["single-match-edit", matchId],
      });
      router.push("/admin-dashboard/matches-management");
    },
  });

  useEffect(() => {
    if (match && selectablePlayers.length > 0) {
      form.reset({
        date: match.date ? new Date(match.date) : null,
        venue: match.venue || "",
        status: normalizeStatus(match.status),
        player1Id: getParticipantId(match?.player1Id ?? match?.pair1Id),
        player2Id: getParticipantId(match?.player2Id ?? match?.pair2Id),
      });
    }
  }, [match, selectablePlayers, form]);




  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Check if values.date is null or an invalid date
    const selectedDate =
      values.date instanceof Date && !isNaN(values.date.getTime())
        ? values.date
        : values.date !== null
          ? new Date(values.date)
          : new Date();  // Fallback to current date if values.date is null

    if (Number.isNaN(selectedDate.getTime())) {
      toast.error("Please select a valid date");
      return;
    }

    selectedDate.setHours(0, 0, 0, 0);

    if (minDate && selectedDate < minDate) {
      toast.error(
        `Round ${match.round} match date must be on or after ${format(
          minDate,
          "MMM dd, yyyy",
        )}.`,
      );
      return;
    }

    if (maxDate && selectedDate > maxDate) {
      toast.error(
        `Round ${match.round} match date must be on or before ${format(
          maxDate,
          "MMM dd, yyyy",
        )}.`,
      );
      return;
    }

    mutate(values);
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                Match Type
              </FormLabel>
              <Input
                value={match.matchType || ""}
                disabled
                className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
              />
            </div>
            <div className="space-y-2">
              <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                Tournament
              </FormLabel>
              <Input
                value={match.tournamentId?.tournamentName || ""}
                disabled
                className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
              />
            </div>
            <div className="space-y-2">
              <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                Round
              </FormLabel>
              <Input
                value={`Round ${match.round} - Match ${match.matchNumber}`}
                disabled
                className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="player1Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Player / Pair 1
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]">
                        <SelectValue placeholder="Select player / pair 1" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {selectablePlayers.map((player) => (
                          <SelectItem
                            key={player._id}
                            value={player._id}
                            className="cursor-pointer rounded-md px-3 py-2.5 transition-colors hover:bg-[#FEECEE] hover:text-[#8E1020] focus:bg-[#FEECEE] focus:text-[#8E1020] data-[state=checked]:bg-[#FFF1F2] data-[state=checked]:text-[#8E1020]"
                          >
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="player2Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Player / Pair 2
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]">
                        <SelectValue placeholder="Select player / pair 2" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[400px] overflow-y-auto">
                        {selectablePlayers.map((player) => (
                          <SelectItem
                            key={player._id}
                            value={player._id}
                            className="cursor-pointer rounded-md px-3 py-2.5 transition-colors hover:bg-[#FEECEE] hover:text-[#8E1020] focus:bg-[#FEECEE] focus:text-[#8E1020] data-[state=checked]:bg-[#FFF1F2] data-[state=checked]:text-[#8E1020]"
                          >
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-black leading-[120%]">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
                          }`}
                      >
                        {field.value instanceof Date && !isNaN(field.value.getTime())
                          ? format(field.value, "MMM dd, yyyy")
                          : "mm/dd/yyyy"}

                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? null)}
                        disabled={(date) => {
                          const d = new Date(date);
                          d.setHours(0, 0, 0, 0);
                          let isDisabled = false;
                          if (minDate && d < minDate) isDisabled = true;
                          if (maxDate && d > maxDate) isDisabled = true;
                          return isDisabled;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Venue
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter venue"
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Match Status
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rescheduled">
                          Rescheduled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin-dashboard/matches-management")}
              className="h-[49px] text-[#929292] text-lg font-medium leading-[150%] border-[1px] border-[#929292] rounded-[8px] py-3 px-16"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000] hover:from-[#310000] hover:to-[#DF1020] transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-20"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditMatchForm;





// "use client";

// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import TableSkeleton from "@/components/reusable/TableSkeleton";
// import ErrorContainer from "@/components/ErrorContainer/ErrorContainer";
// import NotFound from "@/components/reusable/not-found-data";
// import { TournamentPlayersRoundApiResponse } from "../../create-match/_components/round-tournament-data-type";

// type MatchParticipant = {
//   _id: string;
//   fullName?: string;
//   email?: string;
//   teamName?: string;
// };

// type SingleMatchResponse = {
//   success: boolean;
//   message?: string;
//   data: {
//     _id: string;
//     tournamentId: {
//       _id: string;
//       tournamentName: string;
//       sportName: string;
//       format: string;
//     };
//     round: number;
//     matchNumber: number;
//     matchType: string;
//     player1Id: MatchParticipant | null;
//     player2Id: MatchParticipant | null;
//     pair1Id: MatchParticipant | null;
//     pair2Id: MatchParticipant | null;
//     date: string | null;
//     venue?: string;
//     status: string;
//   };
// };

// const ALLOWED_STATUSES = [
//   "pending",
//   "scheduled",
//   "in-progress",
//   "completed",
//   "rescheduled",
// ] as const;

// const formSchema = z.object({
//   date: z.date().nullable(),
//   venue: z.string().min(1, "Venue is required"),
//   status: z.enum(ALLOWED_STATUSES, { message: "Match status is required" }),
// });

// const normalizeStatus = (
//   status?: string,
// ): (typeof ALLOWED_STATUSES)[number] => {
//   const value = status?.trim().toLowerCase();

//   if (!value) return "scheduled";
//   if (value === "ongoing" || value === "in progress") return "in-progress";
//   if (value === "upcoming") return "scheduled";
//   if (value === "cancelled") return "rescheduled"; // legacy fallback

//   if (ALLOWED_STATUSES.includes(value as (typeof ALLOWED_STATUSES)[number])) {
//     return value as (typeof ALLOWED_STATUSES)[number];
//   }

//   return "scheduled";
// };

// const EditMatchForm = () => {
//   const params = useParams();
//   const router = useRouter();
//   const matchId = params?.id as string;

//   const session = useSession();
//   const token = (session?.data?.user as { accessToken: string })?.accessToken;
//   const queryClient = useQueryClient();

//   const {
//     data: matchData,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<SingleMatchResponse>({
//     queryKey: ["single-match-edit", matchId],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/${matchId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       return res.json();
//     },
//     enabled: !!matchId && !!token,
//   });

//   const match = matchData?.data;

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: match?.date ? new Date(match?.date) : null,
//       venue: match?.venue || "",
//       status: normalizeStatus(match?.status),
//     },
//   });

//   const { data: tournamentDetails } =
//     useQuery<TournamentPlayersRoundApiResponse>({
//       queryKey: ["tournament-details-for-edit", match?.tournamentId?._id],
//       queryFn: async () => {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/findplayer/${match?.tournamentId?._id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//         return res.json();
//       },
//       enabled: !!match?.tournamentId?._id && !!token,
//     });

//   const participantOneName =
//     match?.pair1Id?.teamName || match?.player1Id?.fullName || "N/A";
//   const participantTwoName =
//     match?.pair2Id?.teamName || match?.player2Id?.fullName || "N/A";

//   const { mutate, isPending } = useMutation({
//     mutationKey: ["edit-match", matchId],
//     mutationFn: async (values: z.infer<typeof formSchema>) => {
//       const payload = {
//         date:
//           values.date instanceof Date
//             ? format(values.date, "yyyy-MM-dd")
//             : values.date,
//         venue: values.venue,
//         status: values.status,
//       };

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/${matchId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       return res.json();
//     },
//     onSuccess: (data) => {
//       if (!data?.success) {
//         toast.error(data?.message || "Something went wrong");
//         return;
//       }

//       toast.success(data?.message || "Match updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["matches"] });
//       queryClient.invalidateQueries({ queryKey: ["single-match", matchId] });
//       queryClient.invalidateQueries({
//         queryKey: ["single-match-edit", matchId],
//       });
//       router.push("/admin-dashboard/matches-management");
//     },
//   });

//   useEffect(() => {
//     if (!match) return;
//     form.reset({
//       date: match.date ? new Date(match.date) : null,
//       venue: match.venue || "",
//       status: normalizeStatus(match.status),
//     });
//   }, [match, form]);

//   if (isLoading) {
//     return (
//       <div className="p-6">
//         <TableSkeleton />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6">
//         <ErrorContainer
//           message={(error as Error)?.message || "Something went wrong"}
//         />
//       </div>
//     );
//   }

//   if (!matchData?.success || !match) {
//     return (
//       <div className="p-6">
//         <NotFound message="Match not found" />
//       </div>
//     );
//   }

// const onSubmit = (values: z.infer<typeof formSchema>) => {
//   // Check if values.date is null or an invalid date
//   const selectedDate =
//     values.date instanceof Date && !isNaN(values.date.getTime())
//       ? values.date
//       : values.date !== null
//       ? new Date(values.date)
//       : new Date();  // Fallback to current date if values.date is null

//   if (Number.isNaN(selectedDate.getTime())) {
//     toast.error("Please select a valid date");
//     return;
//   }

//   const roundsByNumber =
//     tournamentDetails?.rounds
//       ?.slice()
//       .sort((a, b) => a.roundNumber - b.roundNumber) ?? [];

//   const currentRoundIndex = roundsByNumber.findIndex(
//     (round) => round.roundNumber === match.round,
//   );

//   if (currentRoundIndex !== -1) {
//     const currentRound = roundsByNumber[currentRoundIndex];
//     const nextRound = roundsByNumber[currentRoundIndex + 1];

//     const roundStartDate = new Date(currentRound.date);
//     const nextRoundDate = nextRound ? new Date(nextRound.date) : null;

//     selectedDate.setHours(0, 0, 0, 0);
//     roundStartDate.setHours(0, 0, 0, 0);
//     if (nextRoundDate) nextRoundDate.setHours(0, 0, 0, 0);

//     if (selectedDate < roundStartDate) {
//       toast.error(
//         `Round ${match.round} match date must be on or after ${format(
//           roundStartDate,
//           "MMM dd, yyyy",
//         )}.`,
//       );
//       return;
//     }

//     if (nextRoundDate && selectedDate >= nextRoundDate) {
//       toast.error(
//         `Round ${match.round} match date must be before ${format(
//           nextRoundDate,
//           "MMM dd, yyyy",
//         )}.`,
//       );
//       return;
//     }
//   }

//   mutate(values);
// };

//   return (
//     <div className="p-6">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                 Match Type
//               </FormLabel>
//               <Input
//                 value={match.matchType || ""}
//                 disabled
//                 className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//               />
//             </div>
//             <div className="space-y-2">
//               <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                 Tournament
//               </FormLabel>
//               <Input
//                 value={match.tournamentId?.tournamentName || ""}
//                 disabled
//                 className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//               />
//             </div>
//             <div className="space-y-2">
//               <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                 Round
//               </FormLabel>
//               <Input
//                 value={`Round ${match.round} - Match ${match.matchNumber}`}
//                 disabled
//                 className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                 Player / Pair 1
//               </FormLabel>
//               <Input
//                 value={participantOneName}
//                 disabled
//                 className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//               />
//             </div>
//             <div className="space-y-2">
//               <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                 Player / Pair 2
//               </FormLabel>
//               <Input
//                 value={participantTwoName}
//                 disabled
//                 className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold text-black leading-[120%]">
//                     Start Date
//                   </FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
//                             }`}
//                         >
//                           {field.value instanceof Date && !isNaN(field.value.getTime())
//                             ? format(field.value, "MMM dd, yyyy")
//                             : "mm/dd/yyyy"}

//                           <CalendarIcon className="ml-auto h-4 w-4" />
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value ?? undefined}
//                         onSelect={(date) => field.onChange(date ?? null)}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="venue"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                     Venue
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="Enter venue"
//                       className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                     Match Status
//                   </FormLabel>
//                   <FormControl>
//                     <Select
//                       value={field.value || undefined}
//                       onValueChange={field.onChange}
//                     >
//                       <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="pending">Pending</SelectItem>
//                         <SelectItem value="scheduled">Scheduled</SelectItem>
//                         <SelectItem value="in-progress">In Progress</SelectItem>
//                         <SelectItem value="completed">Completed</SelectItem>
//                         <SelectItem value="rescheduled">
//                           Rescheduled
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="flex justify-end gap-4 pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.push("/admin-dashboard/matches-management")}
//               className="h-[49px] text-[#929292] text-lg font-medium leading-[150%] border-[1px] border-[#929292] rounded-[8px] py-3 px-16"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000] hover:from-[#310000] hover:to-[#DF1020] transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-20"
//             >
//               {isPending ? "Updating..." : "Update"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default EditMatchForm;
