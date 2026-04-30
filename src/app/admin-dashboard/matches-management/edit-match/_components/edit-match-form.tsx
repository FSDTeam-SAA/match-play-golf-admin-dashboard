"use client";

import { useEffect } from "react";
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
};

const ALLOWED_STATUSES = [
  "pending",
  "scheduled",
  "in-progress",
  "completed",
  "rescheduled",
] as const;

const formSchema = z.object({
  date: z.union([z.date(), z.string()]),
  venue: z.string().min(1, "Venue is required"),
  status: z.enum(ALLOWED_STATUSES, { message: "Match status is required" }),
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
  const router = useRouter();
  const matchId = params?.id as string;

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

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

  const match = matchData?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      venue: "",
      status: "scheduled",
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

  const participantOneName =
    match?.pair1Id?.teamName || match?.player1Id?.fullName || "N/A";
  const participantTwoName =
    match?.pair2Id?.teamName || match?.player2Id?.fullName || "N/A";

  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-match", matchId],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const payload = {
        date:
          values.date instanceof Date
            ? format(values.date, "yyyy-MM-dd")
            : values.date,
        venue: values.venue,
        status: values.status,
      };

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
    if (!match) return;
    form.reset({
      date: match.date ? new Date(match.date) : new Date(),
      venue: match.venue || "",
      status: normalizeStatus(match.status),
    });
  }, [match, form]);

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

  if (!matchData?.success || !match) {
    return (
      <div className="p-6">
        <NotFound message="Match not found" />
      </div>
    );
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedDate =
      values.date instanceof Date ? values.date : new Date(values.date);

    if (Number.isNaN(selectedDate.getTime())) {
      toast.error("Please select a valid date");
      return;
    }

    const roundsByNumber =
      tournamentDetails?.rounds
        ?.slice()
        .sort((a, b) => a.roundNumber - b.roundNumber) ?? [];

    const currentRoundIndex = roundsByNumber.findIndex(
      (round) => round.roundNumber === match.round,
    );

    if (currentRoundIndex !== -1) {
      const currentRound = roundsByNumber[currentRoundIndex];
      const nextRound = roundsByNumber[currentRoundIndex + 1];

      const roundStartDate = new Date(currentRound.date);
      const nextRoundDate = nextRound ? new Date(nextRound.date) : null;

      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      roundStartDate.setHours(0, 0, 0, 0);
      if (nextRoundDate) nextRoundDate.setHours(0, 0, 0, 0);

      if (selected < roundStartDate) {
        toast.error(
          `Round ${match.round} match date must be on or after ${format(roundStartDate, "MMM dd, yyyy")}.`,
        );
        return;
      }

      if (nextRoundDate && selected >= nextRoundDate) {
        toast.error(
          `Round ${match.round} match date must be before ${format(nextRoundDate, "MMM dd, yyyy")}.`,
        );
        return;
      }
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
            <div className="space-y-2">
              <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                Player / Pair 1
              </FormLabel>
              <Input
                value={participantOneName}
                disabled
                className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
              />
            </div>
            <div className="space-y-2">
              <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                Player / Pair 2
              </FormLabel>
              <Input
                value={participantTwoName}
                disabled
                className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium text-[#434C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left h-12 ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value
                            ? format(
                                typeof field.value === "string"
                                  ? new Date(field.value)
                                  : field.value,
                                "MMM dd, yyyy",
                              )
                            : "Pick date"}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          typeof field.value === "string"
                            ? new Date(field.value)
                            : field.value
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" />
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

// const formSchema = z.object({
//   date: z.union([z.date(), z.string()]),
//   venue: z.string().min(1, "Venue is required"),
//   status: z.string().min(1, "Match status is required"),
// });

// const normalizeStatus = (status?: string) => {
//   const value = status?.trim().toLowerCase();

//   if (!value) return "scheduled";
//   if (value === "ongoing") return "in progress";
//   if (value === "upcoming") return "scheduled";

//   return value;
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

//   console.log("Fetched match data for editing:", match);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: new Date(),
//       venue: "",
//       status: "",
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
//       date: match.date ? new Date(match.date) : new Date(),
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

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     const selectedDate =
//       values.date instanceof Date ? values.date : new Date(values.date);

//     if (Number.isNaN(selectedDate.getTime())) {
//       toast.error("Please select a valid date");
//       return;
//     }

//     const roundsByNumber =
//       tournamentDetails?.rounds
//         ?.slice()
//         .sort((a, b) => a.roundNumber - b.roundNumber) ?? [];

//     const currentRoundIndex = roundsByNumber.findIndex(
//       (round) => round.roundNumber === match.round,
//     );

//     if (currentRoundIndex !== -1) {
//       const currentRound = roundsByNumber[currentRoundIndex];
//       const nextRound = roundsByNumber[currentRoundIndex + 1];

//       const roundStartDate = new Date(currentRound.date);
//       const nextRoundDate = nextRound ? new Date(nextRound.date) : null;

//       const selected = new Date(selectedDate);
//       selected.setHours(0, 0, 0, 0);
//       roundStartDate.setHours(0, 0, 0, 0);
//       if (nextRoundDate) {
//         nextRoundDate.setHours(0, 0, 0, 0);
//       }

//       if (selected < roundStartDate) {
//         toast.error(
//           `Round ${match.round} match date must be on or after ${format(roundStartDate, "MMM dd, yyyy")}.`,
//         );
//         return;
//       }

//       if (nextRoundDate && selected >= nextRoundDate) {
//         toast.error(
//           `Round ${match.round} match date must be before ${format(nextRoundDate, "MMM dd, yyyy")}.`,
//         );
//         return;
//       }
//     }

//     mutate(values);
//   };

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
//                   <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
//                     Date
//                   </FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           className={`w-full justify-start text-left h-12 ${
//                             !field.value && "text-muted-foreground"
//                           }`}
//                         >
//                           {field.value
//                             ? format(
//                                 typeof field.value === "string"
//                                   ? new Date(field.value)
//                                   : field.value,
//                                 "MMM dd, yyyy",
//                               )
//                             : "Pick date"}
//                           <CalendarIcon className="ml-auto h-4 w-4" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={
//                           typeof field.value === "string"
//                             ? new Date(field.value)
//                             : field.value
//                         }
//                         onSelect={field.onChange}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage className="text-red-500" />
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
//                         <SelectItem value="upcoming">Upcoming</SelectItem>
//                         <SelectItem value="in-progress">In Progress</SelectItem>
//                         <SelectItem value="completed">Completed</SelectItem>
//                         <SelectItem value="cancelled">Cancelled</SelectItem>
//                         <SelectItem value="scheduled">Scheduled</SelectItem>
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
