"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Added for rules
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { TournamentResponseData } from "./single-tournament-data-type"

// Updated schema to match actual data structure
const formSchema = z.object({
  entryConditions: z.array(z.string()).length(3, "Exactly 3 entry conditions are required"),
  range: z.array(z.string()).length(3, "Exactly 3 range values are required"),
  rules: z.string().min(10, "Rules text must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

const TournamentRulesPage = ({ data }: { data: TournamentResponseData }) => {
  const tournamentId = (data as unknown as {_id:string})?._id;
  console.log(data)
  const { data: session } = useSession()
  const token = (session?.user as { accessToken: string })?.accessToken
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entryConditions: ["", "", ""],
      range: ["", "", ""],
      rules: "",
    },
  })

  // Pre-fill form when data loads
  useEffect(() => {
    if (!data) return

    form.reset({
      entryConditions: (data as unknown as { entryConditions?: string[] })?.entryConditions || ["", "", ""],
      range: (data as unknown as { range?: string[] })?.range || ["", "", ""],
      rules: (data as unknown as { rules?: string })?.rules || "",
    })
  }, [data, form])

  const { mutate, isPending } = useMutation({
    mutationKey: ["tournament-details", tournamentId],
    mutationFn: async (values: FormValues) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed to update")
      return res.json()
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Something went wrong")
        return
      }
      toast.success(response?.message || "Tournament updated successfully")
      queryClient.invalidateQueries({ queryKey: ["single-tournament"] })
    },
    onError: () => {
      toast.error("Failed to update tournament")
    },
  })

  function onSubmit(values: FormValues) {
    mutate(values)
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Entry Conditions - 2 fields */}
          <div>
            <h3 className="text-lg font-medium text-[#343A40] mb-4">Entry Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="entryConditions.0"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. Handicap Limit (Playing)"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryConditions.1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. Every Player must have played"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryConditions.2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. Every Player must have played"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Range - 2 fields */}
          <div>
            <h3 className="text-lg font-medium text-[#343A40] mb-4">Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="range.0"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. 24 for Men / 36 for Ladies"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="range.1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. 8 rounds in 12 Months"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="range.2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g. 8 rounds in 12 Months"
                        className="h-[48px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div /> {/* Empty cell for alignment */}
            </div>
          </div>

          {/* Rules Text */}
          <FormField
            control={form.control}
            name="rules"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                  Rules Text
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the full rules text here..."
                    className="min-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              {isPending ? "Saving..." : "Add"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default TournamentRulesPage