export interface MatchApiResponse {
  success: boolean;
  data: {
    matches: MatchItem[];
    pagination: Pagination;
  };
}

export interface MatchItem {
  _id: string;
  tournamentId: TournamentId;
  roundId: RoundInfo;
  matchType: string; // "Single" | "Double" | etc.
  player1Id: PlayerInfo | null;
  player2Id: PlayerInfo | null;
  status: "Upcoming" | "Ongoing" | "Completed"; // customize if needed
  teeTime: string; // ISO date string
  startingHole: number;
  groupNumber: number;
  score:"",
  createdBy: PlayerInfo;
  players: PlayerInfo[];
//   teams: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TournamentId {
  _id: string;
  tournamentName: string;
  sportName: string;
  format: string;
}


export interface RoundInfo {
  _id: string;
  roundName: string;
  roundNumber: number;
  date: string; // ISO date string
}

export interface PlayerInfo {
  _id: string;
  fullName: string;
  email: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
