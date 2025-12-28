"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { TournamentResponseData } from "./single-tournament-data-type"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  rememberEmail: z.string().optional(),
  rounds: z.array(
    z.object({
      date: z.date().nullable(),
    })
  ),
});


const TournamentRounds = (data: { data: TournamentResponseData & { rememberEmail?: number; totalRounds?: number } }) => {
   const tournamentId = (data?.data as unknown as {_id:string})?._id;

   console.log(data?.data)
    const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  console.log(token)
  const queryClient = useQueryClient();


const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    rememberEmail: "",
    rounds: [],
  },
});



  console.log(data?.data)


useEffect(() => {
  if (!data?.data) return;

  const totalRounds = data.data.totalRounds ?? 0;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const existingRounds = data.data.rounds ?? [];

  form.reset({
    // rememberEmail: Number(data?.data?.rememberEmail ?? 5).toString(),
    rememberEmail: data?.data?.rememberEmail ? data?.data?.rememberEmail.toString() : "",
    rounds: Array.from({ length: totalRounds }, (_, index) => ({
      date: existingRounds[index]?.date
        ? new Date(existingRounds[index].date)
        : null,
    })),
  });
}, [data, form]);



const { mutate, isPending } = useMutation({
  mutationKey: ["tournament-details", tournamentId],
  mutationFn: async (payload: {rememberEmail: string, rounds: { roundName: string; date: string | null }[] }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
      {
        method: "PUT",
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
    toast.success(data?.message || "Tournament updated successfully");
    queryClient.invalidateQueries({ queryKey: ["single-tournament"] });
  },
});


function onSubmit(values: z.infer<typeof formSchema>) {
  const payload = {
    rememberEmail: values.rememberEmail || "",
    rounds: values.rounds.map((round, index) => ({
      roundName: `Round ${index + 1}`,
      date: round.date ? format(round.date, "yyyy-MM-dd") : null,
    })),
  };

  mutate(payload);
}


  return (
    <div>
      <h4 className="text-lg md:text-xl font-semibold text-[#181818] leading-[120%]">Reminder Emails Days Before</h4>
      <p className="text-base text-[#181818] leading-[150%] font-normal pt-2">Please enter the number of days before the round deadline for sending a reminder email to those who have not played their match.</p>

      <div className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="rememberEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                    Reminder
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue placeholder="5 Days Later" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Days Later</SelectItem>
                        <SelectItem value="10">10 Days Later</SelectItem>
                        <SelectItem value="15">15 Days Later</SelectItem>
                        <SelectItem value="20">20 Days Later</SelectItem>
                        <SelectItem value="25">25 Days Later</SelectItem>
                        <SelectItem value="30">30 Days Later</SelectItem>
                        <SelectItem value="35">35 Days Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div>
              <h4 className="text-lg md:text-xl text-[#181818] font-semibold leading-[120%]">
                Round Deadlines
              </h4>

              {form.watch("rounds")?.map((_, index) => (
                <div key={index} className="space-y-2 py-2">

                  {/* Deadline Date */}
                  <FormField
                    control={form.control}
                    name={`rounds.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
                                  }`}
                              >
                                {field.value instanceof Date && !isNaN(field.value.getTime())
                                  ? format(field.value, "yyyy-MM-dd")
                                  : "mm/dd/yyyy"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={(date) => field.onChange(date ?? null)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

            </div>
             {/* Buttons */}
          <div className="flex justify-end gap-6 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="h-[49px] text-[#F2415A] text-lg font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-16"
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
  )
}

export default TournamentRounds