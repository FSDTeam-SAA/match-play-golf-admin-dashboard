
"use client";

import { useEffect } from "react";
import { useTournamentStore } from "@/store/useTournamentStore";
import Step1Form from "./step-form1";
import Step2Form from "./setp-form2";

export default function CreateTournamentContainer() {
  const { step } = useTournamentStore();

  // Optional: Clear on mount if you want fresh start
  useEffect(() => {
    // Uncomment if you want to reset on page load
    // reset();
  }, []);

  return (
    <div className="px-6 pt-6 pb-20">
      <div className="">

        {/* Progress Indicator */}
        {/* <div className="flex items-center justify-center mb-10">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-32 h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-300'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-red-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
          </div>
        </div> */}

        {/* Conditional Rendering */}
        {step === 1 && <Step1Form />}
        {step === 2 && <Step2Form />}
      </div>
    </div>
  );
}