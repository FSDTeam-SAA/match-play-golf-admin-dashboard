export interface TournamentPlayersRoundApiResponse {
  success: boolean
  message: string
  data: TournamentPlayer[]
  rounds: TournamentRound[]
}


export interface TournamentPlayer {
  _id: string
  tournamentId: string
  playerId: string | null
  pairId: Pair
  assignMatch: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}


export interface Pair {
  _id: string
  tournamentId: string
  teamName: string
  player1: Player | null
  player2: Player | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}


export interface Player {
  _id: string
  fullName: string
  email: string
  phone: string
  clubName: string
  handicap: string
}


export interface TournamentRound {
  _id: string
  tournamentId: string
  roundName: string
  roundNumber: number
  date: string
  status: "Scheduled" | "Ongoing" | "Completed" | string
  createdBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

