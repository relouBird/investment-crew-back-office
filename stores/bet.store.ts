import { defineStore } from "pinia";
import useBetService from "~/services/bet.service";
import type { BetModel } from "~/types/api-bet.type";

interface State {
  selected: BetModel | null;
  items: BetModel[];
  protos: BetModel[];
  count: number;
}

// le service qui gère les requetes
const service = useBetService();

const useBetStore = defineStore("bet-store", {
  persist: true,
  state: (): State => ({
    selected: null,
    items: [],
    protos: [],
    count: 0,
  }),

  getters: {
    getBets: (state) => state.items,
    getPrototypes: (state) => state.protos,
    getCount: (state) => state.count,
  },

  actions: {
    // Recuperer tous les utilisateurs...
    async fetch() {
      const response = service.fetch && (await service.fetch({}));

      if (response.status === 200) {
        this.items = [];
        const datas = response.data as BetModel[];
        this.items = datas;
        this.count = this.items.length;
      } else {
        console.log("users-store =>", this.items);
      }
      return response;
    },

    addProtos(proto: BetModel) {
      this.protos.push(proto);
    },
  },
});

export default useBetStore;
