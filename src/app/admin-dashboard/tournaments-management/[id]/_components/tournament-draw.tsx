import React from 'react'
import { Button } from "@/components/ui/button"

const TournamentDrawPage = () => {
  return (
    <div>
      <h3 className="text-lg md:text-xl lg:text-2xl text-[#181818] font-bold leading-[150%]">Create Draw</h3>
      <ul className="py-4 md:py-5 lg:py-6">
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal">You have 16 participants added out of 16 needed.</li>
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal py-3">You have 3 participants registered.</li>
        <li className="text-sm md:text-base leading-[150%] text-[#181818] font-normal">You have 0 of participants seeded.</li>
      </ul>

      <div className="pt-2">
          <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#343A40] hover:bg-black/60 text-[#F8F9FA] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[122px]"
              >
                Participant Invite Emails Sent
              </Button>
      </div>

       {/* Buttons */}
       <div className="flex justify-start items-center gap-4 pt-6 pb-10 md:pb-14 lg:pb-20">
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#FEECEE] hover:bg-[#FEECEE] text-[#8E938F] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-[63px]"
              >
                Event Drawn
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#E6E7E6] hover:bg-gray-300 text-[#343A40] text-base font-medium leading-[150%] border-none rounded-[8px] py-3 px-5 md:px-20"
              >
                Preview
              </Button>
              <Button
                type="submit"
                className="h-[49px] bg-[#E5102E]
            hover:bg-red-700
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-[57px]"
              >
                Event Started
              </Button>
            </div>

            <div className="flex justify-start items-center gap-6 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-[49px] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[81px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[49px] bg-[#FEECEE] text-[#F2415A] text-base font-medium leading-[150%] border-[1px] border-[#F2415A] rounded-[8px] py-3 px-5 md:px-[88px]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="h-[49px] bg-gradient-to-b from-[#DF1020] to-[#310000]
            hover:from-[#310000] hover:to-[#DF1020]
            transition-all duration-300 text-[#F7F8FA] font-bold text-base leading-[120%] rounded-[8px] px-5 md:px-6"
              >
                Update Even (Active)
              </Button>
            </div>
    </div>
  )
}

export default TournamentDrawPage