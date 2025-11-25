import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { notify } from "~/helpers/notifications";
import useBetService from "~/services/bet.service";
import type {
  BetModel,
  BetModelResponse,
  BetsModelResponse,
} from "~/types/api-bet.type";

interface State {
  selected: BetModel | null;
  items: BetModel[];
  count: number;
}

// le service qui gère les requetes
const service = useBetService();

const useBetStore = defineStore("bet-store", {
  persist: true,
  state: (): State => ({
    selected: null,
    items: [],
    count: 0,
  }),

  getters: {
    getBets: (state) => state.items,
    getCount: (state) => state.count,
  },

  actions: {
    // creer un pari
    async create(bet: BetModel) {
      const response: AxiosResponse =
        service.create && (await service.create(bet));

      if (response.status === 201) {
        let datas = response.data as BetModelResponse;
        this.items.push(datas.data);

        notify({
          color: "success",
          message: datas.message,
          visible: true,
        });
      }

      return response;
    },

    // Recuperer tous les paris...
    async fetch() {
      const response = service.fetch && (await service.fetch({}));
      if (response.status === 200) {
        this.items = [];
        const datas = response.data as BetsModelResponse;
        this.items = datas.data;
        this.count = this.items.length;

        console.log("bets-store =>", this.items);
      } else {
        console.log("bets-store =>", this.items);
      }
      return response;
    },

    async remove() {
      let response =
        service.remove && (await service.remove(this.selected?.id ?? "", {}));

      this.items = this.items.filter((item) => item.id != this.selected?.id);
      return response;
    },
  },
});

export default useBetStore;
