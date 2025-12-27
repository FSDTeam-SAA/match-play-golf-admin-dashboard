
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
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required"),
  seed: z.string().min(1, "Seed is required"),
})

const formSchema = z.object({
  players: z.array(playerSchema),

  csvFile: z
    .instanceof(File)
    .refine((file) => file.type === "text/csv", {
      message: "Only CSV files are allowed",
    })
    .optional(),
})

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



const { mutate, isPending } = useMutation({
  mutationKey: ["tournament-participants", tournamentId],
  mutationFn: async (values: FormValues) => {
    const formData = new FormData()

    // players (array → string)
    formData.append("players", JSON.stringify(values.players))

    // csv file
    if (values.csvFile) {
      formData.append("csvFile", values.csvFile)
    }

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
    form.reset()
  },
  onError: () => {
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
              <h5 className="font-semibold mb-4">
                Player {index + 1}
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name={`players.${index}.fullName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 max-w-sm">
                <FormField
                  control={form.control}
                  name={`players.${index}.seed`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seed*</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
      <FormLabel>Import CSV File (Optional)</FormLabel>
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




// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm, useFieldArray } from "react-hook-form"
// import { z } from "zod"
// import { useSession } from "next-auth/react"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { useState, useCallback } from "react"

// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { toast } from "sonner"

// import CsvUploadInput from "./CsvUploadInput"
// import { Tournament } from "./single-tournament-data-type"

// // PapaParse for CSV parsing (lightweight, no extra deps needed if you install it)
// // Run: npm install papaparse
// // or: yarn add papaparse
// import Papa from "papaparse"

// const playerSchema = z.object({
//   fullName: z.string().min(2, "Full name is required"),
//   email: z.string().email("Invalid email"),
//   phone: z.string().min(6, "Phone is required"),
//   seed: z.string().min(1, "Seed is required"),
// })

// const formSchema = z.object({
//   players: z.array(playerSchema),
//   csvFile: z
//     .instanceof(File)
//     .refine((file) => file?.type === "text/csv", {
//       message: "Only CSV files are allowed",
//     })
//     .optional(),
// })

// type FormValues = z.infer<typeof formSchema>

// interface Props {
//   data: Tournament
// }

// const TournamentParticipantsPage = ({ data }: Props) => {
//   const queryClient = useQueryClient()
//   const { _id: tournamentId, format } = data
//   const isPair = format === "Pair"

//   const { data: session } = useSession()
//   const token = (session?.user as { accessToken: string })?.accessToken

  
//   const [csvPreview, setCsvPreview] = useState<string[]>([])
//   const [csvError, setCsvError] = useState<string | null>(null)

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       csvFile: undefined,
//       players: isPair
//         ? [
//             { fullName: "", email: "", phone: "", seed: "" },
//             { fullName: "", email: "", phone: "", seed: "" },
//           ]
//         : [{ fullName: "", email: "", phone: "", seed: "" }],
//     },
//   })

//   const { fields } = useFieldArray({
//     control: form.control,
//     name: "players",
//   })

//   // Parse CSV when file changes
//   const handleCsvChange = useCallback((file: File | null) => {
//     form.setValue("csvFile", file ?? undefined)

//     if (!file) {
//       setCsvPreview([])
//       setCsvError(null)
//       return
//     }

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const expectedHeaders = ["fullName", "email", "phone", "seed"]
//         const headers = results.meta.fields || []

//         const hasValidHeaders = expectedHeaders.every((h) =>
//           headers.map((hh) => hh.toLowerCase()).includes(h.toLowerCase())
//         )

//         if (!hasValidHeaders) {
//           setCsvError(
//             "CSV must contain columns: fullName, email, phone, seed (case-insensitive)"
//           )
//           setCsvPreview([])
//           return
//         }

//         setCsvPreview(results.data as string[])
//         setCsvError(null)
//       },
//       error: (err: Error) => {
//         setCsvError("Failed to parse CSV: " + err.message)
//         setCsvPreview([])
//       },
//     })
//   }, [form])

//   const handleCsvRemove = () => {
//     handleCsvChange(null)
//   }

//   const { mutate, isPending } = useMutation({
//     mutationKey: ["tournament-participants", tournamentId],
//     mutationFn: async (values: FormValues) => {
//       const formData = new FormData()
//       formData.append("players", JSON.stringify(values.players))

//       if (values.csvFile) {
//         formData.append("csvFile", values.csvFile)
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       )

//       if (!res.ok) throw new Error("Failed to update")
//       return res.json()
//     },
//     onSuccess: (response) => {
//       if (!response?.success) {
//         toast.error(response?.message || "Something went wrong")
//         return
//       }
//       toast.success(response?.message || "Tournament updated successfully")
//       queryClient.invalidateQueries({ queryKey: ["single-tournament"] })
//       form.reset()
//       setCsvPreview([])
//       setCsvError(null)
//     },
//     onError: () => {
//       toast.error("Failed to update tournament")
//     },
//   })

//   const onSubmit = (values: FormValues) => {
//     mutate(values)
//   }

//   return (
//     <div>
//       <h4 className="text-lg md:text-xl font-semibold pb-6">
//         Participants ({format})
//       </h4>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
//           {fields.map((field, index) => (
//             <div key={field.id} className="border border-gray-200 rounded-lg p-6">
//               <h5 className="font-semibold mb-4">Player {index + 1}</h5>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <FormField
//                   control={form.control}
//                   name={`players.${index}.fullName`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Name*</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name={`players.${index}.email`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email*</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name={`players.${index}.phone`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone*</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="mt-4 max-w-sm">
//                 <FormField
//                   control={form.control}
//                   name={`players.${index}.seed`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Seed*</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           ))}

//           {/* CSV Upload */}
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="csvFile"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>Import Participants from CSV</FormLabel>
//                   <FormControl>
//                     <CsvUploadInput
//                       file={form.watch("csvFile") || null}
//                       onChange={handleCsvChange}
//                       onRemove={handleCsvRemove}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* CSV Preview */}
//             {csvError && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                 {csvError}
//               </div>
//             )}

//             {csvPreview.length > 0 && (
//               <div className="mt-6">
//                 <h5 className="font-semibold mb-3 text-green-700">
//                   CSV Preview ({csvPreview.length} rows)
//                 </h5>
//                 <div className="overflow-x-auto border rounded-lg">
//                   <table className="w-full text-sm text-left">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-2">Full Name</th>
//                         <th className="px-4 py-2">Email</th>
//                         <th className="px-4 py-2">Phone</th>
//                         <th className="px-4 py-2">Seed</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {csvPreview?.slice(0, 10).map((row, i) => (
//                         <tr key={i} className="border-t">
//                           <td className="px-4 py-2">{row?.fullName || row["Full Name"] || "-"}</td>
//                           <td className="px-4 py-2">{row?.email || row.Email || "-"}</td>
//                           <td className="px-4 py-2">{row?.phone || row.Phone || "-"}</td>
//                           <td className="px-4 py-2">{row?.seed || row.Seed || "-"}</td>
//                         </tr>
//                       ))}
//                       {csvPreview.length > 10 && (
//                         <tr>
//                           <td colSpan={4} className="px-4 py-3 text-center text-gray-500 italic">
//                             ... and {csvPreview.length - 10} more rows
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-6 pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 form.reset()
//                 setCsvPreview([])
//                 setCsvError(null)
//               }}
//               className="h-[49px] text-[#F2415A] text-lg font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-16"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
//                 hover:from-[#310000] hover:to-[#DF1020]
//                 transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-20"
//             >
//               {isPending ? "Saving..." : "Add"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }

// export default TournamentParticipantsPage



