"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  matchType: z.string().min(1, {
    message: "Match Type must be select",
  }),
  tournamentId: z.string().min(2, {
    message: "Tournament Id must be at least 2 characters.",
  }),
  roundId: z.string().min(2, {
    message: "Round Id must be at least 2 characters.",
  }),
  round: z.string().min(2, {
    message: "Round must be at least 2 characters.",
  }),
  player1: z.string().min(1, {
    message: "Player 1 must be select",
  }),
  player2: z.string().min(1, {
    message: "Player 2 must be select",
  }),
  score: z.string().min(2, {
    message: "Score must be at least 2 characters.",
  }),
  matchStatus: z.string().min(1, {
    message: "Match Status must be select",
  }),
  date: z.union([z.date(), z.string()]),
});

const CreateMatchForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchType: "",
      tournamentId: "",
      roundId: "",
      round: "",
      player1: "",
      player2: "",
      score: "",
      date: new Date(),
      matchStatus: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                          <SelectValue placeholder="Single" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="pairs">Pairs</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Tournament ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                        placeholder="M001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roundId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Round ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                        placeholder="Spring Championship"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="round"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Round
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                        placeholder="Final"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Player 1
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                          <SelectValue placeholder="Michael Johnson" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="pairs">Pairs</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="player2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Player 2
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                          <SelectValue placeholder="David Thompson" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="pairs">Pairs</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
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
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                      Score
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                        placeholder="3-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
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
                name="matchStatus"
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
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
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
                //   disabled={isPending}
                type="submit"
                className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-20"
              >
                {/* {isPending ? "Saving..." : "Save Changes"} */}
                Add
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateMatchForm;
