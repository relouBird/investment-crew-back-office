import { defineStore } from "pinia";
import useAuthService from "~/services/auth.service";
import type { User, UserDetails } from "~/types/user.type";

interface State {
  selected: UserDetails | null;
  items: UserDetails[];
  count: number;
}

// le service qui gère les requetes
const service = useAuthService();

const useUserStore = defineStore("users-store", {
  persist: true,

  state: (): State => ({
    selected: null,
    items: [],
    count: 0,
  }),

  getters: {
    getUsers: (state) => state.items,
    getCount: (state) => state.count,
  },

  actions: {
    // Recuperer tous les utilisateurs...
    async fetch() {
      const response = service.fetch && (await service.fetch({}));

      if (response.status === 200) {
        this.items = [];
        const datas = response.data as User[];
        datas.forEach((user) => {
          this.items.push({ ...user.user_metadata, ...user });
        });
        this.count = this.items.length;
      } else {
        console.log("users-store =>", this.items);
      }
      return response;
    },
  },
});

export default useUserStore;
