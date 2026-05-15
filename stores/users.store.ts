import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import useAuthService from "~/services/auth.service";
import type { User, UserDetails, UserMetaData } from "~/types/user.type";

interface State {
  selected: UserDetails | null;
  items: UserDetails[];
  count: number;
}

// le service qui gère les requetes
const service = useAuthService();

const useUserStore = defineStore("users-store", {
  persist: {
    storage: {
      getItem: (key) => useCookie(key).value ?? null,
      setItem: (key, value) => (useCookie(key).value = value),
    },
  },

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
      const response: AxiosResponse =
        service.fetch && (await service.fetch({}));

      if (response.status === 200 || response.status === 201) {
        this.items = [];
        const datas = response.data.data as User[];
        for (let i = 0; i < datas.length; i++) {
          const user = datas[i];
          this.items.push({ ...user.user_metadata, ...user });
        }
        this.count = this.items.length;
      } else {
        console.log("users-store =>", this.items);
      }
      return response;
    },

    async updateUserDetails(
      usersData: Partial<UserDetails>,
      user: UserMetaData,
    ) {
      const payloadToUse: UserMetaData = {
        ...user,
        ...usersData,
      };

      console.log("PAYLOAD-USER-ID ===>", payloadToUse);

      return "";
    },
  },
});

export default useUserStore;
