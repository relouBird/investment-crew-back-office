export type AreaType = {
  id: number;
  name: string;
  code: string;
  flag: string | null;
};

export type TeamType = {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
};

export type CompetitionType = {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
};

export type SeasonType = {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
};

export type PlayerType = {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string | Date;
  nationality: string;
};

export type CompetitionModel = {
  id: number;
  area: AreaType;
  name: string;
  code: string | null;
  type: string;
  emblem: string | null;
  plan: string;
  currentSeason: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
  } | null;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
};

export type MatchModel = {
  area: AreaType;
  competition: CompetitionType;
  season: SeasonType;
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: TeamType;
  awayTeam: TeamType;
  score: {
    winner: string | null;
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  odds: {
    msg: string;
  };
  referees: any[]; // Tu peux typer plus tard si l’API renvoie des arbitres
};

export type TeamModel = {
  area: AreaType;
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string; // Image ou drapeau du club...
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: CompetitionType[];
  coach: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth: string | Date;
    nationality: string;
    contract: {
      start: string | Date;
      until: string | Date;
    };
  };
  squad: PlayerType[];
  staff: [];
  lastUpdated: string | Date;
};

export interface ApiFootballCompetitionResponse {
  count: number;
  filter: {
    client: string;
  };
  competitions: CompetitionModel[];
}

export interface ApiFootballCompetitionResponse {
  message: string;
  data: CompetitionModel[];
}

export interface ApiFootballMatchsResponse {
  message: string;
  data: MatchModel[];
}

export interface ApiFootballTeamsResponse {
  message: string;
  data: TeamModel[];
}

export interface ApiFootballMatchResponse {
  message: string;
  data: MatchModel;
}

// Partie pari simplement parlant

export interface BetTeamType {
  name: string;
  crest: string;
  tla: string;
}

export interface BetModel {
  id?: number | string;
  score: string;
  winner: string;
  homeTeam: BetTeamType;
  awayTeam: BetTeamType;
  start_at: string;
  end_at: string;
  winPercentage: number;
  lossPercentage: number;
  created_at?: string;
  isActive: boolean;
  isEnded: boolean;
}

export interface UserBetModel {
  id?: string;
  uid: string;
  matchId: string | number;
  match: BetModel;
  prediction: string;
  win?: boolean;
  potentialGain: number;
  potentialLoss: number;
  created_at?: string;
}

export interface BetModelResponse {
  message: string;
  data: BetModel;
}

export interface BetsModelResponse {
  message: string;
  data: BetModel[];
}


export interface UserBetModelResponse {
  message: string;
  data: UserBetModel;
}

export interface UserBetsModelResponse {
  message: string;
  data: UserBetModel[];
}