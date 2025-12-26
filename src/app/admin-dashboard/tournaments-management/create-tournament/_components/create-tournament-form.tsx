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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: "Tournament Name must be at least 2 characters.",
  }),
  sportName: z.string().min(2, {
    message: "Sport Name must be at least 2 characters.",
  }),
  totalDrawSize: z.string().min(1, {
    message: "Total Draw Size is required.",
  }),
  drawFormat: z.string().min(1, {
    message: "Draw Format is required.",
  }),
  format: z.string().min(1, {
    message: "Format is required.",
  }),
   terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

const DRAW_FORMAT_OPTIONS = [
  // { id: "matrix", label: "Matrix 2", value: "matrix" },
  { id: "knockout", label: "Knockout ?", value: "knockout" },
  { id: "teams", label: "Teams ?", value: "teams" },
]

const CreateTournament = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      sportName: "",
      totalDrawSize: "",
      drawFormat: "",
      format: "",
      terms: false,
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
                    {DRAW_FORMAT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`py-3 px-4 rounded-[8px] border-2 text-base font-medium leading-[120%] transition-all duration-200 ${
                          field.value === option.value
                            ? "border-primary bg-[#F0FFFE] text-[#434C45]"
                            : "border-[#C0C3C1] bg-white text-[#434C45] hover:border-primary"
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
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="w-full h-[100px] flex items-center justify-start pl-8 text-xl font-bold text-[#343A40] leading-[120%] bg-[#E6E7E6] rounded-[6px]">
              Total : $ 15
            </div>

             <div>
               <p className="text-base text-[#1F2937] leading-[150%] ">Your personal information will be used to process your order, enhance your experience on our website, and for other purposes outlined in our <Link href="/privacy-policy" className="text-base text-[#E5102E] leading-[150%] underline">privacy policy.</Link></p>
             <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="terms"
                        className="mt-3"
                      />
                    </FormControl>
                     <div>
                     <Label
                        htmlFor="terms"
                        className="text-base text-[#1F2937] font-normal leading-[150%]"
                      >

                        I agree to the 
                        <Link href="/terms-and-conditions" className="text-base text-[#E5102E] font-semibold"> Terms and Conditions </Link>
                      </Label> <br />
                     
                        <FormMessage className="text-red-500 pt-2" />
                      </div>
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
            transition-all duration-300 text-[#F7F8FA] font-bold text-lg leading-[120%] rounded-[8px] px-12"
              >
                {/* {isPending ? "Saving..." : "Save Changes"} */}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateTournament;
