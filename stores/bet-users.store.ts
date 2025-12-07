import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { notify } from "~/helpers/notifications";
import useUserBetService from "~/services/user-bet.service";
import type {
  UserBetModel,
  UserBetModelResponse,
  UserBetsModelResponse,
} from "~/types/api-bet.type";

interface State {
  selected: UserBetModel | null;
  items: UserBetModel[];
  count: number;
}

// le service qui gère les requetes
const service = useUserBetService();

const useUserBetStore = defineStore("users-bet-store", {
  persist: true,
  state: (): State => ({
    selected: null,
    items: [],
    count: 0,
  }),

  getters: {
    getUsersBets: (state) => state.items,
    getCount: (state) => state.count,
  },

  actions: {
    // creer un pari
    async create(bet: UserBetModel) {
      const response: AxiosResponse =
        service.create && (await service.create(bet));

      if (response.status === 201) {
        let datas = response.data as UserBetModelResponse;
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
        const datas = response.data as UserBetsModelResponse;
        this.items = datas.data;
        this.count = this.items.length;

        console.log("bets-store =>", this.items);
      } else {
        console.log("bets-store =>", this.items);
      }
      return response;
    },

    // Recuperer tous les paris...
    async udpate() {
      const response =
        service.update && (await service.update(this.selected, {}));
      if (response.status === 200 || response.status === 201) {
        const datas = response.data as UserBetModelResponse;
        let index = this.items.findIndex((u) => u.id == datas.data.id);

        if (index >= 0) {
          this.items[index] = datas.data;
        }

        console.log("bets-store-update =>", datas.data);
      } else {
        console.log("bets-store-update =>", this.items);
      }
      return response;
    },

    async end() {
      const response = service.find && (await service.find(this.selected, {}));
      if (response.status === 200 || response.status === 201) {
        const datas = response.data as UserBetModelResponse;
        let index = this.items.findIndex((u) => u.id == datas.data.id);

        if (index >= 0) {
          this.items[index] = datas.data;
        }

        console.log("bets-store-end =>", datas.data);
      } else {
        console.log("bets-store-end =>", this.items);
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

export default useUserBetStore;
