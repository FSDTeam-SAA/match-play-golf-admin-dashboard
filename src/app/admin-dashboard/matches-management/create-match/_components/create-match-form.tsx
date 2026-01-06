"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TournamentListApiResponse } from "./tournament-data-type";
import { TournamentPlayersRoundApiResponse } from "./round-tournament-data-type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const formSchema = z.object({
  matchType: z.string().min(1, {
    message: "Match Type must be select",
  }),
  tournamentId: z.string().min(1, "Tournament Id is required"),
  roundId: z.string().min(1, "Round Id is required"),
  roundName: z.string().min(1, "Round is required"),
  player1Id: z.string().min(1, {
    message: "Player 1 must be select",
  }),
  player1Type: z.enum(["player", "pair"]),
  player2Id: z.string().min(1, {
    message: "Player 2 must be select",
  }),
  player2Type: z.enum(["player", "pair"]),

  // score: z.string().min(2, {
  //   message: "Score must be at least 2 characters.",
  // }),
  status: z.string().min(1, {
    message: "Match Status must be select",
  }),
  date: z.union([z.date(), z.string()]),
});

const CreateMatchForm = () => {
  const router = useRouter();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchType: "",
      tournamentId: "",
      roundId: "",
      roundName: "",
      player1Id: "",
      player1Type: "player",
      player2Id: "",
      player2Type: "player",
      // score: "",
      date: new Date(),
      status: "",
    },
  });


  /* -------------------- Watch tournament -------------------- */
  const selectedTournamentId = form.watch("tournamentId");

  /* -------------------- Tournament list -------------------- */
  const {
    data: tournamentData,
    isLoading: tournamentLoading,
  } = useQuery<TournamentListApiResponse>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament?limit=1000`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return res.json();
    },
    enabled: !!token,
  });

  /* -------------------- Tournament details (rounds + players) -------------------- */
  const {
    data: tournamentDetails,
    isLoading: detailsLoading,
  } = useQuery<TournamentPlayersRoundApiResponse>({
    queryKey: ["tournament-details", selectedTournamentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/findplayer/${selectedTournamentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      if (!res.ok) throw new Error("Failed to fetch tournament details");
      return res.json();
    },
    enabled: !!selectedTournamentId && !!token,
  });

  /* -------------------- Dropdown options -------------------- */
  const tournamentOptions =
    tournamentData?.data?.tournaments?.map((t) => ({
      value: t._id,
      label: t.tournamentName,
    })) ?? [];

  const roundOptions =
    tournamentDetails?.rounds?.map((r) => ({
      value: r._id,
      label: r.roundName,
    })) ?? [];

  const participantOptions =
    tournamentDetails?.data?.map((item) => {
      if (item.playerId) {
        return {
          value: item.playerId._id,
          label: item.playerId.fullName,
          type: "player",
        };
      }

      if (item.pairId) {
        return {
          value: item.pairId._id,
          label: item.pairId.teamName,
          type: "pair",
        };
      }

      return null;
    }).filter(Boolean) ?? [];



  const { mutate, isPending } = useMutation({
    mutationKey: ["add-match"],

    mutationFn: async (values: z.infer<typeof formSchema>) => {

      const payload: Record<string, string | Date | undefined> = {
        matchType: values.matchType,
        tournamentId: values.tournamentId,
        roundId: values.roundId,
        roundName: values.roundName,
        status: values.status,
        date:
          values.date instanceof Date
            ? values.date.toISOString()
            : values.date,
      };

      // Player / Pair mapping
      if (values.player1Type === "player") {
        payload.player1Id = values.player1Id;
      } else {
        payload.pair1Id = values.player1Id;
      }

      if (values.player2Type === "player") {
        payload.player2Id = values.player2Id;
      } else {
        payload.pair2Id = values.player2Id;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      return res.json();
    },

    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Match created successfully");
      form.reset();
      router.push("/organizer/matches-management")
    },
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if players are same
    // if (values.player1Id === values.player2Id) {
    //   alert("Player 1 and Player 2 cannot be same");
    //   return;
    // }

    if (
      values.player1Id === values.player2Id &&
      values.player1Type === values.player2Type
    ) {
      toast.error("Participants cannot be same");
      return;
    }

    // If matchType is Pair, check pair IDs
    // if (values.matchType === "Pair" && values.player1Id === values.player2Id) {
    //   toast.error("Pair 1 and Pair 2 cannot be same");
    //   return;
    // }

    mutate(values);
  }


  return (
    <div className="p-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="matchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Match Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                          <SelectValue placeholder="Single" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Pair">Pair</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />


              {/* Tournament */}
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament ID</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("roundId", "");
                        form.setValue("player1Id", "");
                        form.setValue("player2Id", "");
                      }}
                      disabled={tournamentLoading}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue placeholder="Select tournament" />
                      </SelectTrigger>
                      <SelectContent className="h-[250px] overflow-y-auto">
                        {tournamentOptions.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Round ID */}
              <FormField
                control={form.control}
                name="roundId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round ID</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedTournamentId || detailsLoading}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue
                          placeholder={
                            !selectedTournamentId
                              ? "Select tournament first"
                              : "Select round"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roundOptions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <FormField
                control={form.control}
                name="roundName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round Name</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedTournamentId || detailsLoading}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue
                          placeholder={
                            !selectedTournamentId
                              ? "Select tournament first"
                              : "Select round"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roundOptions.map((r) => (
                          <SelectItem key={r.value} value={r.label}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="player1Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player / Pair 1</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        const selected = participantOptions.find(p => p?.value === val);
                        field.onChange(val);
                        form.setValue("player1Type", selected?.type as "player" | "pair");
                      }}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {participantOptions.map((p) => (
                          <SelectItem key={p!.value} value={p!.value}>
                            {p!.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="player2Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player / Pair 2</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        const selected = participantOptions.find(p => p?.value === val);
                        field.onChange(val);
                        form.setValue("player2Type", selected?.type as "player" | "pair");
                      }}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {participantOptions.map((p) => (
                          <SelectItem key={p!.value} value={p!.value}>
                            {p!.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />



            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
                              }`}
                          >
                            {field.value
                              ? format(field.value, "MMM dd, yyyy")
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Match Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                          <SelectValue placeholder="Completed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="h-[49px] text-[#929292] text-lg font-medium leading-[150%] border-[1px] border-[#929292] rounded-[8px] py-3 px-16"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-20"
              >
                {isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateMatchForm;
