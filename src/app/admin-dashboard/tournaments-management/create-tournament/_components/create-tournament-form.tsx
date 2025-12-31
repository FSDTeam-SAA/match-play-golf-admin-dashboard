'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: 'Tournament Name must be at least 2 characters.',
  }),
  sportName: z.string().min(2, {
    message: 'Sport Name must be at least 2 characters.',
  }),
  totalDrawSize: z.string().min(1, {
    message: 'Total Draw Size is required.',
  }),
  drawFormat: z.string().min(1, {
    message: 'Draw Format is required.',
  }),
  format: z.string().min(1, {
    message: 'Format is required.',
  }),
})

const DRAW_FORMAT_OPTIONS = [
  // { id: "matrix", label: "Matrix 2", value: "matrix" },
  { id: 'knockout', label: 'Knockout ?', value: 'Knockout' },
  { id: 'teams', label: 'Teams ?', value: 'Teams' },
]

const CreateTournament = () => {
  const { data: session } = useSession()
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: '',
      sportName: '',
      totalDrawSize: '',
      drawFormat: '',
      format: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const token = session?.user?.accessToken || ''

      if (!token) {
        toast.error('You must be logged in to create a tournament')
        return
      }

      const payload = {
        tournamentName: values.tournamentName,
        sportName: values.sportName,
        totalDrawSize: values.totalDrawSize,
        drawFormat: values.drawFormat,
        format: values.format,
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Failed to create tournament')
        return
      }

      toast.success('Tournament created successfully!')
      form.reset()
      // router.push("/tournaments"); // Optional: redirect to tournaments page
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="p-6">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tournamentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Tournament Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Spring Championship 2023"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sportName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Sport Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]"
                      placeholder="Spring Championship 2023"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

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
                      {DRAW_FORMAT_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`py-4 px-6 rounded-[8px] border-2 text-base font-semibold leading-[120%] transition-all duration-300 shadow-sm ${
                            field.value === option.value
                              ? 'border-[#E5102E] bg-gradient-to-br from-[#FFE5E8] to-[#FFF5F6] text-[#E5102E] shadow-md scale-105'
                              : 'border-[#C0C3C1] bg-white text-[#434C45] hover:border-[#E5102E] hover:shadow-md'
                          }`}
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

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Format <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-[48px] py-2 px-3 rounded-[8px] border border-[#C0C3C1] text-base font-medium leading-[120%] text-[#434C45)]">
                        <SelectValue placeholder="Pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Pairs">Pair</SelectItem>
                        <SelectItem value="Team">Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalDrawSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#434C45] leading-[150%] font-medium">
                    Total Draw Size
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="128">256</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
                className="h-[49px] text-[#929292] text-lg font-medium leading-[150%] border-[1px] border-[#929292] rounded-[8px] py-3 px-16"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-12"
              >
                {isLoading ? 'Creating...' : 'Create Tournament'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateTournament
