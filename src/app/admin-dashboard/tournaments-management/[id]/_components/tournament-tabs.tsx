<<<<<<< HEAD
'use client'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import TournamentDetailsPage from './tournament-details'
import TournamentRulesPage from './tournament-rules'
import TournamentParticipantsPage from './tournament-participants'
import TournamentRounds from './tournament-rounds'
import TournamentDrawPage from './tournament-draw'
import { useSession } from 'next-auth/react'
import {
  Tournament,
  TournamentApiResponse,
  TournamentResponseData,
} from './single-tournament-data-type'

const TournamentsDetails = ({ id }: { id: string }) => {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  const [isActive, setIsActive] = useState('details')

  // get api call
  const { data } = useQuery<TournamentApiResponse>({
    queryKey: ['single-tournament', id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return res.json()
    },
    enabled: !!token,
=======
"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import TournamentDetailsPage from "./tournament-details";
import TournamentRulesPage from "./tournament-rules";
import TournamentParticipantsPage from "./tournament-participants";
import TournamentRounds from "./tournament-rounds";
import TournamentDrawPage from "./tournament-draw";
import { useSession } from "next-auth/react";
import { Tournament, TournamentApiResponse, TournamentResponseData} from "./single-tournament-data-type";

const TournamentsDetails = ({id}:{id:string}) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [isActive, setIsActive] = useState("details");


  // get api call 
  const { data } = useQuery<TournamentApiResponse>({
    queryKey: ["single-tournament", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament/${id}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return res.json();
    },
    enabled: !!token
>>>>>>> origin/main
  })

  console.log(data)

  return (
    <div className="p-6">
<<<<<<< HEAD
=======

>>>>>>> origin/main
      {/* sub-pages */}
      <div>
        <div className="flex items-center gap-8 border-b-[1px] border-gray-300">
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
<<<<<<< HEAD
              isActive === 'details' &&
              'text-primary font-bold bg-primary/15 border-b-2 border-red-500'
            }`}
            onClick={() => setIsActive('details')}
=======
              isActive === "details" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("details")}
>>>>>>> origin/main
          >
            Details
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
<<<<<<< HEAD
              isActive === 'rules' &&
              'text-primary font-bold bg-primary/15 border-b-2 border-red-500'
            }`}
            onClick={() => setIsActive('rules')}
=======
              isActive === "rules" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("rules")}
>>>>>>> origin/main
          >
            Rules
          </button>

          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
<<<<<<< HEAD
              isActive === 'participants' &&
              'text-primary font-bold bg-primary/15 border-b-2 border-red-500'
            }`}
            onClick={() => setIsActive('participants')}
          >
            Participants
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === 'rounds' &&
              'text-primary font-bold bg-primary/15 border-b-2 border-red-500'
            }`}
            onClick={() => setIsActive('rounds')}
          >
            Rounds
          </button>
          <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === 'draw' &&
              'text-primary font-bold bg-primary/15 border-b-2 border-red-500'
            }`}
            onClick={() => setIsActive('draw')}
=======
              isActive === "participants" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("participants")}
          >
            Participants
          </button>
           <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === "rounds" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("rounds")}
          >
            Rounds
          </button>
           <button
            className={`text-gray-500 py-2 px-4 rounded-t-lg ${
              isActive === "draw" &&
              "text-primary font-bold bg-primary/15 border-b-2 border-primary"
            }`}
            onClick={() => setIsActive("draw")}
>>>>>>> origin/main
          >
            Draw
          </button>
        </div>

        <div className="mt-8">
<<<<<<< HEAD
          {isActive === 'details' && (
            <div>
              <TournamentDetailsPage
                data={data?.data as unknown as Tournament}
              />
            </div>
          )}

          {isActive === 'rules' && (
            <div>
              <TournamentRulesPage
                data={data?.data || ({} as TournamentResponseData)}
              />
            </div>
          )}
          {isActive === 'participants' && (
            <div>
              <TournamentParticipantsPage
                data={data?.data as unknown as Tournament}
              />
            </div>
          )}
          {isActive === 'rounds' && (
            <div>
              <TournamentRounds
                data={data?.data || ({} as TournamentResponseData)}
              />
            </div>
          )}
          {isActive === 'draw' && (
            <div>
              <TournamentDrawPage />
=======
          {isActive === "details" && (

              <div>
              <TournamentDetailsPage  data={data?.data as unknown as Tournament}/>
            </div>
          )}

          {isActive === "rules" && (
            <div>
              <TournamentRulesPage  data={data?.data || {} as TournamentResponseData} />
            </div>
          )}
          {isActive === "participants" && (
            <div>
              <TournamentParticipantsPage  data={data?.data as unknown as Tournament}  />
            </div>
          )}
            {isActive === "rounds" && (
            <div>
              <TournamentRounds  data={data?.data || {} as TournamentResponseData} />
            </div>
          )}
          {isActive === "draw" && (
            <div>
              <TournamentDrawPage  data={data?.data || {} as TournamentResponseData} />
>>>>>>> origin/main
            </div>
          )}
        </div>
      </div>
    </div>
<<<<<<< HEAD
  )
}

export default TournamentsDetails
=======
  );
};

export default TournamentsDetails;
>>>>>>> origin/main
