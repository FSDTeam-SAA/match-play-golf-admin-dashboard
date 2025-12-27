'use client'

import CreateTournament from './create-tournament-form'

export default function CreateTournamentContainer() {
  return (
    <div className="px-6 pb-10">
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
        {/* create tournaments */}
        <CreateTournament />
      </div>
    </div>
  )
}
