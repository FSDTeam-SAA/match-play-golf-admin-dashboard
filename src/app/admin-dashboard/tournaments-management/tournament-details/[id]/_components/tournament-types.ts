import { Match } from "./draw";

export interface Player {
  _id: string;
  fullName: string;
  email: string;
  clubName: string;
  handicap: string;
  profileImage: string;
}

export interface Round {
  _id: string;
  tournamentId: string;
  roundName: string;
  roundNumber: number;
  date: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Tournament {
  _id: string;
  orderId: string;
  tournamentName: string;
  sportName: string;
  drawFormat: string;
  format: string;
  drawSize: number;
  price?: string;
  paymentStatus: string;
  numberOfSeeds: number;
  onHold: boolean;
  status: string;
  tournamentStatus: string;
  rules: string[];
  totalParticipants: number;
  registeredPlayers: string[];
  totalRounds: number;
  rememberEmail: number;
  knockoutStage: null | string;
  createdBy: string;
  entryConditions: string[];
  range: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  location: string;
  billingAddress?: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    streetAddress: string;
    city: string;
    zipcode: string;
    companyName: string;
  };
}

export interface MatchesResponse {
  success: boolean;
  tournament: Tournament;
  roundNumber: string;
  matches: Match[];
  rounds: Round[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TournamentApiResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    tournament: Tournament;
  };
}
