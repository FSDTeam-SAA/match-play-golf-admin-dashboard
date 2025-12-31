
export interface Tournament {
  _id: string
  orderId: string
  tournamentName: string
  sportName: string
  drawFormat: "Knockout" | "League" | string
  format: "Single" | "Team" | string
  drawSize: number

  price?: string
  paymentStatus: "pending" | "paid" | string
  status: "upcoming" | "ongoing" | "completed" | string

  totalParticipants: number
  totalRounds: number
  rememberEmail: number
  playerCount: number

  numberOfSeeds?: number
  // knockoutStage?: any | null

  // entryConditions: any[]
  // range: any[]
  // registeredPlayers: any[]

  billingAddress?: BillingAddress

  createdBy: CreatedBy

  location?: string

  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string

  __v: number
}

export interface CreatedBy {
  _id: string
  fullName: string
  email: string
}


export interface BillingAddress {
  fullName: string
  email: string
  phone: string
  country: string
  streetAddress: string
  city: string
  zipcode: string
  companyName: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}



export interface TournamentListApiResponse {
  success: boolean
  data: {
    tournaments: Tournament[]
    pagination: Pagination
  }
}

