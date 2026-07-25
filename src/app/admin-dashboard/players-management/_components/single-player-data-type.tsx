export interface SinglePlayerApiResponse {
  success: boolean;
  data: TournamentPlayer;
  message?: string;
}

export interface TournamentPlayer {
  _id: string;
  tournamentId: string | Tournament;
  tournamentDetails?: Tournament;
  playerId: Player | null;
  pairId: Pair | null;
  assignMatch: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  _id?: string;
  tournamentName?: string;
  format?: string;
}

export interface Pair {
  _id: string;
  tournamentId: string;
  teamName: string;
  player1: Player;
  player2: Player;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  captainName?: string | null;
  clubName?: string;
  seeder?: number;
}
