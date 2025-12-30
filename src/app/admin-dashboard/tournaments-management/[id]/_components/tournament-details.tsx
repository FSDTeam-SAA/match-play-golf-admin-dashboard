<<<<<<< HEAD
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
=======
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
>>>>>>> origin/main
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
<<<<<<< HEAD
} from '@/components/ui/form'
=======
} from "@/components/ui/form"
>>>>>>> origin/main
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
<<<<<<< HEAD
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
=======
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react";
>>>>>>> origin/main
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
<<<<<<< HEAD
} from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon } from 'lucide-react'

import { format } from 'date-fns'
import { useEffect } from 'react'
import { Tournament } from './single-tournament-data-type'
import { Calendar } from '@/components/ui/calender'

const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: 'Event Name must be at least 2 characters.',
  }),
  sportName: z.string().min(2, {
    message: 'Sport must be at least 2 characters.',
=======
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useEffect } from "react"
import { Tournament } from "./single-tournament-data-type";

const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: "Event Name must be at least 2 characters.",
  }),
  sportName: z.string().min(2, {
    message: "Sport must be at least 2 characters.",
>>>>>>> origin/main
  }),
  numberOfSeeds: z.coerce.number().pipe(z.number().min(1).int()),
  drawSize: z.coerce.number().pipe(z.number().min(1).int()),

  drawFormat: z.string().min(1, {
<<<<<<< HEAD
    message: 'Draw Format is required.',
  }),
  format: z.string().min(1, {
    message: 'Format is required.',
=======
    message: "Draw Format is required.",
  }),
  format: z.string().min(1, {
    message: "Format is required.",
>>>>>>> origin/main
  }),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),

  location: z.string().optional(),
<<<<<<< HEAD
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
=======
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
>>>>>>> origin/main
  }),
})

const TournamentDetailsPage = (data: { data: Tournament }) => {
  console.log(data)
<<<<<<< HEAD
  const tournamentId = (data?.data as unknown as { _id: string })?._id
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken
  console.log(token)
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: '',
      sportName: '',
      drawSize: 8,
      drawFormat: '',
      format: '',
      startDate: null,
      endDate: null,
      numberOfSeeds: 1,
      location: '',
=======
  const tournamentId = (data?.data as unknown as {_id:string})?._id;
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  console.log(token)
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      sportName: "",
      drawSize: 8,
      drawFormat: "",
      format: "",
      startDate: null,
      endDate: null,
      numberOfSeeds: 1,
      location: "",
>>>>>>> origin/main
      terms: false,
    },
  })

  const DRAW_FORMAT_OPTIONS = [
    // { id: "matrix", label: "Matrix 2", value: "matrix" },
<<<<<<< HEAD
    { id: 'knockout', label: 'Knockout ?', value: 'knockout' },
    { id: 'teams', label: 'Teams ?', value: 'teams' },
  ]

  useEffect(() => {
    if (!data?.data) return

    form.reset({
      tournamentName: data?.data?.tournamentName ?? '',
      sportName: data?.data?.sportName ?? '',
=======
    { id: "knockout", label: "Knockout ?", value: "knockout" },
    { id: "teams", label: "Teams ?", value: "teams" },
  ]



  useEffect(() => {
    if (!data?.data) return;

    form.reset({
      tournamentName: data?.data?.tournamentName ?? "",
      sportName: data?.data?.sportName ?? "",
>>>>>>> origin/main
      drawFormat: data?.data?.drawFormat?.toLowerCase(),
      format: data?.data?.format?.toLowerCase(),
      drawSize: Number(data?.data?.drawSize),
      location: data?.data?.location,
      numberOfSeeds: Number(data?.data?.totalRounds),
<<<<<<< HEAD
      startDate: data?.data?.startDate ? new Date(data?.data?.startDate) : null,
      endDate: data?.data?.endDate ? new Date(data?.data?.endDate) : null,
      terms: false,
    })
  }, [data, form])

  const { mutate, isPending } = useMutation({
    mutationKey: ['tournament-details', tournamentId],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      )
      return res.json()
    },
    onSuccess: data => {
      if (!data?.success) {
        toast.error(data?.message || 'Something went wrong')
        return
      }
      toast.success(data?.message || 'Tournement updated successfully')
      queryClient.invalidateQueries({ queryKey: ['single-tournament'] })
    },
  })

=======
      startDate: data?.data?.startDate
        ? new Date(data?.data?.startDate)
        : null,
      endDate: data?.data?.endDate
        ? new Date(data?.data?.endDate)
        : null,
      terms: false,
    });
  }, [data, form]);


  const { mutate, isPending } = useMutation({
    mutationKey: ["tournament-details", tournamentId],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Tournement updated successfully")
      queryClient.invalidateQueries({ queryKey: ["single-tournament"] })
    },
  })


>>>>>>> origin/main
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    mutate(values)
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tournamentName"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                    Event Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Spring Championship 2025"
                      {...field}
                    />
=======
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">Event Name *</FormLabel>
                  <FormControl>
                    <Input className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]" placeholder="Spring Championship 2025" {...field} />
>>>>>>> origin/main
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sportName"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                    Sport *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Golf"
                      {...field}
                    />
=======
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">Sport *</FormLabel>
                  <FormControl>
                    <Input className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]" placeholder="Golf" {...field} />
>>>>>>> origin/main
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="drawFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Draw Format <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-6">
<<<<<<< HEAD
                      {DRAW_FORMAT_OPTIONS.map(option => (
=======
                      {DRAW_FORMAT_OPTIONS.map((option) => (
>>>>>>> origin/main
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => field.onChange(option.value)}
<<<<<<< HEAD
                          className={`py-4 px-6 rounded-[8px] border-2 text-base font-semibold leading-[120%] transition-all duration-300 shadow-sm ${
                            field.value === option.value
                              ? 'border-[#E5102E] bg-gradient-to-br from-[#FFE5E8] to-[#FFF5F6] text-[#E5102E] shadow-md scale-105'
                              : 'border-[#C0C3C1] bg-white text-[#434C45] hover:border-[#E5102E] hover:shadow-md'
                          }`}
=======
                          className={`py-3 px-4 rounded-[8px] border-2 text-base font-medium leading-[120%] transition-all duration-200 ${field.value === option.value
                            ? "border-primary bg-[#F0FFFE] text-[#434C45]"
                            : "border-[#C0C3C1] bg-white text-[#434C45] hover:border-primary"
                            }`}
>>>>>>> origin/main
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
<<<<<<< HEAD
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
=======

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

>>>>>>> origin/main
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Format <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
<<<<<<< HEAD
                    <Select value={field.value} onValueChange={field.onChange}>
=======
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
>>>>>>> origin/main
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue placeholder="Pairs" />
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
              name="drawSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Draw Size
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
<<<<<<< HEAD
                      onValueChange={value => field.onChange(Number(value))}
=======
                      onValueChange={(value) => field.onChange(Number(value))}
>>>>>>> origin/main
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue placeholder="Parallel Unique  Club" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                        <SelectItem value="64">64</SelectItem>
                        <SelectItem value="128">128</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfSeeds"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                    Number of Seeds *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Completed"
                      value={String(field.value)}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
=======
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">Number of Seeds *</FormLabel>
                  <FormControl>
                    <Input className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]" placeholder="Completed" value={String(field.value)} onChange={(e) => field.onChange(Number(e.target.value))} />
>>>>>>> origin/main
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-black leading-[120%]">
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
<<<<<<< HEAD
                          className={`w-full justify-start text-left h-12 ${
                            !field.value && 'text-muted-foreground'
                          }`}
=======
                          className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
                            }`}
>>>>>>> origin/main
                        >
                          {/* {field.value
                            ? format(field.value, "MMM dd, yyyy")
                            : "mm/dd/yyyy"} */}
<<<<<<< HEAD
                          {field.value instanceof Date &&
                          !isNaN(field.value.getTime())
                            ? format(field.value, 'MMM dd, yyyy')
                            : 'mm/dd/yyyy'}
=======
                          {field.value instanceof Date && !isNaN(field.value.getTime())
                            ? format(field.value, "MMM dd, yyyy")
                            : "mm/dd/yyyy"}
>>>>>>> origin/main

                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      /> */}
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
<<<<<<< HEAD
                        onSelect={date => field.onChange(date ?? null)}
=======
                        onSelect={(date) => field.onChange(date ?? null)}
>>>>>>> origin/main
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-black leading-[120%]">
                    End Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
<<<<<<< HEAD
                          className={`w-full justify-start text-left h-12 ${
                            !field.value && 'text-muted-foreground'
                          }`}
=======
                          className={`w-full justify-start text-left h-12 ${!field.value && "text-muted-foreground"
                            }`}
>>>>>>> origin/main
                        >
                          {/* {field.value
                            ? format(field.value, "MMM dd, yyyy")
                            : "mm/dd/yyyy"} */}
<<<<<<< HEAD
                          {field.value instanceof Date &&
                          !isNaN(field.value.getTime())
                            ? format(field.value, 'MMM dd, yyyy')
                            : 'mm/dd/yyyy'}
=======
                          {field.value instanceof Date && !isNaN(field.value.getTime())
                            ? format(field.value, "MMM dd, yyyy")
                            : "mm/dd/yyyy"}
>>>>>>> origin/main

                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      /> */}
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
<<<<<<< HEAD
                        onSelect={date => field.onChange(date ?? null)}
=======
                        onSelect={(date) => field.onChange(date ?? null)}
>>>>>>> origin/main
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
              name="location"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Home V Away"
                      {...field}
                    />
=======
                  <FormLabel className="text-base text-[#343A40] leading-[150%] font-medium">Location</FormLabel>
                  <FormControl>
                    <Input className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]" placeholder="Home V Away" {...field} />
>>>>>>> origin/main
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

<<<<<<< HEAD
=======

>>>>>>> origin/main
          <div>
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
<<<<<<< HEAD
                <FormItem className="flex items-center space-x-3">
=======
                <FormItem className="flex items-start space-x-3">
>>>>>>> origin/main
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
<<<<<<< HEAD
                    />
                  </FormControl>

                  <div className="flex flex-col">
=======
                      className="mt-3"
                    />
                  </FormControl>
                  <div>
>>>>>>> origin/main
                    <Label
                      htmlFor="terms"
                      className="text-base text-[#1F2937] font-normal leading-[150%]"
                    >
<<<<<<< HEAD
                      If checked, the next round of matches will not be
                      displayed until the current round has been completed.
                    </Label>
=======

                      If checked, the next round of matches will not be displayed until the current round has been completed.
                    </Label> <br />
>>>>>>> origin/main

                    <FormMessage className="text-red-500 pt-2" />
                  </div>
                </FormItem>
              )}
            />
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
<<<<<<< HEAD
              {isPending ? 'Adding...' : 'Add'}
=======
              {isPending ? "Adding..." : "Add"}
>>>>>>> origin/main
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

<<<<<<< HEAD
export default TournamentDetailsPage
=======
export default TournamentDetailsPage
>>>>>>> origin/main
