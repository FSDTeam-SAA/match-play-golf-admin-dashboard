

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
import { toast } from "sonner"

import CsvUploadInput from "./CsvUploadInput"
import { Tournament } from "./single-tournament-data-type"

/* ---------------- ZOD SCHEMA ---------------- */

const playerSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  seed: z.string().optional(),
})

const formSchema = z
  .object({
    players: z.array(playerSchema),
    csvFile: z
      .instanceof(File)
      .refine((file) => file.type === "text/csv", {
        message: "Only CSV files are allowed",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Check if CSV file exists
      const hasCsvFile = !!data.csvFile

      // Check if any player has filled data
      const hasPlayerData = data.players.some(
        (player) =>
          player.fullName ||
          player.email ||
          player.phone ||
          player.seed
      )

      // At least one of them must be present
      return hasCsvFile || hasPlayerData
    },
    {
      message: "Please provide either CSV file or player information",
      path: ["csvFile"],
    }
  )
  .refine(
    (data) => {
      // If no CSV file, validate that players with data are complete
      if (!data.csvFile) {
        const playersWithData = data.players.filter(
          (player) =>
            player.fullName ||
            player.email ||
            player.phone ||
            player.seed
        )

        // Check if all filled players have complete data
        return playersWithData.every(
          (player) =>
            player.fullName &&
            player.fullName.length >= 2 &&
            player.email &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(player.email) &&
            player.phone &&
            player.phone.length >= 6 &&
            player.seed &&
            player.seed.length >= 1
        )
      }
      return true
    },
    {
      message: "Please complete all fields for each player you're adding",
      path: ["players"],
    }
  )

type FormValues = z.infer<typeof formSchema>

/* ---------------- COMPONENT ---------------- */

interface Props {
  data: Tournament
}

const TournamentParticipantsPage = ({ data }: Props) => {
  const queryClient = useQueryClient()
  const { _id: tournamentId, format } = data
  const isPair = format === "Pair"

  const { data: session } = useSession()
  const token = (session?.user as { accessToken: string })?.accessToken

  /* ---------------- FORM ---------------- */

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      csvFile: undefined,
      players: isPair
        ? [
            { fullName: "", email: "", phone: "", seed: "" },
            { fullName: "", email: "", phone: "", seed: "" },
          ]
        : [{ fullName: "", email: "", phone: "", seed: "" }],
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: "players",
  })


  // previous code 
    // const { mutate, isPending } = useMutation({
    // mutationKey: ["tournament-participants", tournamentId],


    // mutationFn: async (values: FormValues) => {
    //   const formData = new FormData()

    //   // Filter out empty players (players with no data)
    //   const filledPlayers = values.players.filter(
    //     (player) =>
    //       player.fullName ||
    //       player.email ||
    //       player.phone ||
    //       player.seed
    //   )

    //   // Only send players if there are filled ones
    //   if (filledPlayers.length > 0) {
    //     formData.append("players", JSON.stringify(filledPlayers))
    //   }

    //   // csv file
    //   if (values.csvFile) {
    //     formData.append("csvFile", values.csvFile)
    //   }

    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: formData,
    //     }
    //   )

    //   if (!res.ok) throw new Error("Failed to update")
    //   return res.json()
    // },
    // onSuccess: (response) => {
    //   if (!response?.success) {
    //     toast.error(response?.message || "Something went wrong")
    //     return
    //   }
    //   toast.success(response?.message || "Tournament updated successfully")
    //   queryClient.invalidateQueries({ queryKey: ["single-tournament"] })
    //   form.reset()
    // },
    // onError: () => {
    //   toast.error("Failed to update tournament")
    // },

    // })


const { mutate, isPending } = useMutation({
  mutationKey: ["tournament-participants", tournamentId],

  mutationFn: async (values: FormValues) => {
    const filledPlayers = values.players.filter(
      (player) =>
        player.fullName ||
        player.email ||
        player.phone ||
        player.seed
    )

    // 🔹 CASE 1: CSV NOT uploaded → send JSON
    if (!values.csvFile) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            players: filledPlayers,
          }),
        }
      )

      if (!res.ok) {
        throw new Error("Failed to update tournament")
      }

      return res.json()
    }

    // 🔹 CASE 2: CSV uploaded → send FormData
    const formData = new FormData()

    if (filledPlayers.length > 0) {
      formData.append("players", JSON.stringify(filledPlayers))
    }

    formData.append("csvFile", values.csvFile)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )

    if (!res.ok) {
      throw new Error("Failed to update tournament")
    }

    return res.json()
  },

  onSuccess: (response) => {
    if (!response?.success) {
      toast.error(response?.message || "Something went wrong")
      return
    }

    toast.success(response?.message || "Tournament updated successfully")
    queryClient.invalidateQueries({ queryKey: ["single-tournament"] })
    form.reset()
  },

  onError: (error) => {
    console.error(error)
    toast.error("Failed to update tournament")
  },
})






  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (values: FormValues) => {
    const payload = {
      players: values.players,
      csvFile: values.csvFile,
    }

    mutate(payload)
  }

  /* ---------------- UI ---------------- */

  return (
    <div>
      <h4 className="text-lg md:text-xl font-semibold pb-6">
        Participants ({format})
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name={`players.${index}.fullName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#343A40] font-semibold leading-[150%]">
                        Player {index + 1} Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[48px] rounded-[4px] border border-[#C0C3C1] text-base text-[#343A40] placeholder:text-[#8E938F] font-semibold leading-[150%]"
                          placeholder="Liam Davies(Collingtree Park GC)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`players.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#343A40] font-semibold leading-[150%]">
                        Player {index + 1} Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[48px] rounded-[4px] border border-[#C0C3C1] text-base text-[#343A40] placeholder:text-[#8E938F] font-semibold leading-[150%]"
                          placeholder="yx04lbn@yahoo.co.uk"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`players.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#343A40] font-semibold leading-[150%]">
                        Player {index + 1} Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[48px] rounded-[4px] border border-[#C0C3C1] text-base text-[#343A40] placeholder:text-[#8E938F] font-semibold leading-[150%]"
                          placeholder="Collingtree Park GC"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name={`players.${index}.seed`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#343A40] font-semibold leading-[150%]">
                        Seed
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[48px] rounded-[4px] border border-[#C0C3C1] text-base text-[#343A40] placeholder:text-[#8E938F] font-semibold leading-[150%]"
                          placeholder="Enter Seed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          {/* CSV Upload */}
          <FormField
            control={form.control}
            name="csvFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#343A40] font-semibold leading-[150%]">
                  Import CSV File (Optional)
                </FormLabel>
                <FormControl>
                  <CsvUploadInput
                    value={field.value || null}
                    onChange={(file) => {
                      field.onChange(file)
                    }}
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

export default TournamentParticipantsPage

