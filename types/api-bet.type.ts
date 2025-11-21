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
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
  };
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

export interface BetModel {
  id?: number | string;
  created_at: string;
  match_id: number;
}

export interface ApiFootballCompetitionResponse {
  message: string;
  data: CompetitionModel[];
}

export interface ApiFootballMatchsResponse {
  message: string;
  data: MatchModel[];
}

export interface ApiFootballMatchResponse {
  message: string;
  data: MatchModel;
}
