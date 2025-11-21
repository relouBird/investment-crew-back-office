import { defineStore } from "pinia";
import useBetService from "~/services/bet.service";
import type {
  BetModel,
  CompetitionModel,
  MatchModel,
} from "~/types/api-bet.type";

interface State {
  selectedCompetition: CompetitionModel | null;
  selectedMatch: MatchModel | null;
  competitions: CompetitionModel[] | null;
  matches: MatchModel[] | null;
}

// le service qui gère les requetes
const service = useBetService();

const useBetApiStore = defineStore("bet-api-store", {
  persist: true,

  state: (): State => ({
    selectedCompetition: null,
    selectedMatch: null,
    competitions: null,
    matches: null,
  }),

  getters: {
    getCompetitions: (state) => state.competitions,
    getMatches: (state) => state.matches,
  },

  actions: {
    // Recuperer tous les utilisateurs...
    async fetchCompetitions() {
      const response =
        service.getCompetitions && (await service.getCompetitions({}));

      if (response.status === 200) {
        this.competitions = [];
        const datas = response.data as CompetitionModel[];
        this.competitions = datas;
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
        const datas = response.data as MatchModel[];
        this.matches = datas;

        console.log("bet-api--matches-store =>", this.competitions);
      } else {
        this.matches = [];
      }
      return response;
    },

    // Recuperer tous les details d'un matchs...
    async fetchMatchDetails(matchId: string) {
      const response =
        service.getCompetitions && (await service.getMatch(matchId, {}));

      if (response.status === 200) {
        const datas = response.data as MatchModel;
        this.selectedMatch = datas;
      } else {
        console.log("bet-api--match-store =>", this.competitions);
      }
      return response;
    },
  },
});

export default useBetApiStore;
