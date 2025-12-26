export interface BillingAddress {
  fullName: string
  email: string
  phone: string
  country: string
  streetAddress: string
  city: string
  state?: string // optional (not always present)
  zipcode: string
  companyName?: string // optional (not always present)
}

export interface CreatedBy {
  _id: string
  fullName: string
  email: string
}

export interface Tournament {
  _id: string
  orderId: string
  tournamentName: string
  sportName: string
  drawFormat: string
  format: string
  drawSize: number
  paymentStatus: string
  status: string
  // rules: any[];                // array is empty, so type as any[] (or string[] if you know)
  createdBy: CreatedBy
  billingAddress: BillingAddress
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  __v: number
  playerCount: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TournamentData {
  tournaments: Tournament[]
  pagination: Pagination
}

export interface TournamentApiResponse {
  success: boolean
  data: TournamentData
}
