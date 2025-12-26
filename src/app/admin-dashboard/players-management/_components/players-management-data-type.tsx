// Main response interface
export interface TournamentPlayerApiResponse {
    success: boolean;
    count: number;
    pagination: Pagination;
    filters: Filters;
    data: TournamentPlayer[];
}

// Pagination interface
export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
}

// Filters interface
export interface Filters {
    tournamentName: string | null;
    search: string | null;
}

// Main data interface
export interface TournamentPlayer {
    _id: string;
    tournamentId: Tournament;
    playerId: Player | null;
    pairId: Pair | null;
    assignMatch: boolean;
    isActive: boolean;
    __v: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

// Tournament interface
export interface Tournament {
    _id: string;
    tournamentName: string;
    sportName: string;
    format: "Single" | "Pair" | "Team"; // Based on observed values
}

// Player interface
export interface Player {
    status: string; // e.g., "active"
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    clubName: string;
    country: string;
    handicap: string;
    profileImage: string;
}

// Pair interface (for pair/team formats)
export interface Pair {
    _id: string;
    tournamentId: string;
    teamName: string;
    player1: PlayerSummary;
    player2: PlayerSummary;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Simplified player interface for pairs
export  interface PlayerSummary {
    _id: string;
    fullName: string;
    email: string;
    profileImage: string;
}