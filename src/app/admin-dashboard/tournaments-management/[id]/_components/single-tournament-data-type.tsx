// // Billing Address
// export interface BillingAddress {
//   fullName: string;
//   email: string;
//   phone: string;
//   country: string;
//   streetAddress: string;
//   city: string;
//   state: string;
//   zipcode: string;
//   companyName: string;
// }

// // Main Tournament / Order Data
// export interface TournamentOrderData {
//   billingAddress: BillingAddress;
//   _id: string;
//   orderId: string;
//   tournamentName: string;
//   sportName: string;
//   drawFormat: string;
//   format: string;
//   drawSize: number;
//   location: string;
//   price: string;
//   paymentStatus: "pending" | "paid" | "failed";
//   status: "scheduled" | "completed" | "cancelled";
//   totalParticipants: number;
//   registeredPlayers: string[];
//   totalRounds: number;
//   rememberEmail: number;
//   knockoutStage: null | unknown;
//   createdBy: string;
//   startDate: string; // ISO Date
//   endDate: string;   // ISO Date
//   createdAt: string; // ISO Date
//   updatedAt: string; // ISO Date
//   __v: number;
//   entryConditions: string[];
//   range: string[];
//   rules: string;
// }

// // API Response Wrapper
// export interface TournamentOrderResponse {
//   success: boolean;
//   data: TournamentOrderData;
// }














export interface TournamentApiResponse {
  success: boolean
  message: string
  data: TournamentResponseData
}


export interface TournamentResponseData {
  tournament: Tournament
  registration: Registration
  rounds: Round[]
}


export interface Tournament {
  billingAddress: BillingAddress
  _id: string
  orderId: string
  tournamentName: string
  sportName: string
  drawFormat: string
  format: "Single" | "Pair"
  drawSize: number
  price: string
  paymentStatus: "pending" | "paid"
  status: "scheduled" | "ongoing" | "completed"
  totalParticipants: number
  registeredPlayers: string[]
  totalRounds: number
  rememberEmail: number
  knockoutStage: null | string
  createdBy: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  entryConditions: string[]
  range: string[]
  rules: string
  location: string
  numberOfSeeds: number
}


export interface BillingAddress {
  fullName: string
  email: string
  phone: string
  country: string
  streetAddress: string
  city: string
  state: string
  zipcode: string
  companyName: string
}

export interface Registration {
  type: "Single" | "Pair"
  users: string[]
  pairs: Pair[]
}

export interface Pair {
  tournamentId: string
  teamName: string
  player1: string
  player2: string
  isActive: boolean
  _id: string
  createdAt: string
  updatedAt: string
}

export interface Round {
  tournamentId: string
  roundName: string
  roundNumber: number
  date: string
  status: "Scheduled" | "Ongoing" | "Completed"
  createdBy: string
  _id: string
  createdAt: string
  updatedAt: string
  rounds?: Array<{
    date: string | Date;
    roundName?: string;
  }>;
  totalRounds?: number;
  rememberEmail?: number;
}

