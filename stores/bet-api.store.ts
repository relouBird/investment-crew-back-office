import { defineStore } from "pinia";
import useBetService from "~/services/bet.service";
import type {
  ApiFootballCompetitionResponse,
  ApiFootballMatchResponse,
  ApiFootballMatchsResponse,
  ApiFootballTeamsResponse,
  CompetitionModel,
  TeamModel,
  MatchModel,
} from "~/types/api-bet.type";

interface State {
  selectedCompetition: CompetitionModel | null;
  selectedMatch: MatchModel | null;
  selectedTeam: TeamModel | null;
  competitions: CompetitionModel[] | null;
  matches: MatchModel[] | null;
  teams: TeamModel[] | null;
}

// le service qui gère les requetes
const service = useBetService();

const useBetApiStore = defineStore("bet-api-store", {
  persist: true,

  state: (): State => ({
    selectedCompetition: null,
    selectedMatch: null,
    selectedTeam: null,
    competitions: null,
    matches: null,
    teams: null,
  }),

  getters: {
    getCompetitions: (state) => state.competitions,
    getMatches: (state) => state.matches,
    getTeams: (state) => state.teams,
  },

  actions: {
    // Recuperer toutes les competitions...
    async fetchCompetitions() {
      const response =
        service.getCompetitions && (await service.getCompetitions({}));

      if (response.status === 200) {
        this.competitions = [];
        const datas = response.data as ApiFootballCompetitionResponse;
        this.competitions = datas.data;
        console.log("bet-api--competition-store =>", this.competitions);
      } else {
        //
        this.competitions = [];
      }
      return response;
    },

    // Recuperer tous les matchs...
    async fetchMatchsCompetition(competitionId: string | number) {
      const response =
        service.getMatchsCompetition &&
        (await service.getMatchsCompetition(competitionId, {}));

      if (response.status === 200) {
        this.matches = [];
        const datas = response.data as ApiFootballMatchsResponse;
        this.matches = datas.data;

        console.log("bet-api--matches-store =>", this.competitions);
      } else {
        this.matches = [];
      }
      return response;
    },

    // Recuperer tous les teams...
    async fetchTeamsCompetition(competitionId: string | number) {
      const response =
        service.getTeamsCompetition &&
        (await service.getTeamsCompetition(competitionId, {}));

      if (response.status === 200) {
        this.teams = [];
        const datas = response.data as ApiFootballTeamsResponse;
        this.teams = datas.data;

        console.log("bet-api--teams-store =>", this.competitions);
      } else {
        this.teams = [];
      }
      return response;
    },

    // Recuperer tous les details d'un matchs...
    async fetchMatchDetails(matchId: string) {
      const response =
        service.getCompetitions && (await service.getMatch(matchId, {}));

      if (response.status === 200) {
        const datas = response.data as ApiFootballMatchResponse;
        this.selectedMatch = datas.data;
      } else {
        console.log("bet-api--match-store =>", this.competitions);
      }
      return response;
    },

    // Selection une competition
    updateSelectedCompetition(competition: CompetitionModel) {
      this.selectedCompetition = competition;
    },

    // retirer une competition
    removeSelectedCompetition() {
      this.selectedCompetition = null;
    },

    // Selection un match
    updateSelectedMatch(match: MatchModel) {
      this.selectedMatch = match;
    },

    // retirer une match
    removeSelectedMatch() {
      this.selectedMatch = null;
    },

    // Selection un team
    updateSelectedTeam(match: TeamModel) {
      this.selectedTeam = match;
    },

    // retirer une match
    removeSelectedTeam() {
      this.selectedTeam = null;
    },
  },
});

export default useBetApiStore;
