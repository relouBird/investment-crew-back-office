import type { AxiosResponse } from "axios";
import type { Emitter } from "mitt";
import useTransactionService from "~/services/transaction.service";
import type { EventsProps } from "~/types";
import type {
  TransactionModel,
  TransactionResponse,
  TransactionsResponse,
} from "~/types/transaction.type";

type StateProps = {
  selected: TransactionModel | null;
  items: TransactionModel[] | null;
};

// le service qui gère les requetes
const service = useTransactionService();

const useTransactionStore = defineStore("transaction-store", {
  state: () =>
    <StateProps>{
      selected: null,
      items: null,
    },
  persist: true,
  getters: {
    getTransactions: (state) => state.items,
    getSelected: (state) => state.selected,
  },
  actions: {
    async fetch() {
      let response: AxiosResponse = service.fetch && (await service.fetch({}));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TransactionsResponse;
        console.log("data-getted-message =>", data.message);
        this.items = data.data;
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      } else {
        console.log("error =>", response.data);
      }

      return response;
    },

    async find(product: TransactionModel | string, query = {}) {
      const response: AxiosResponse =
        service.find && (await service.find(product, query));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TransactionResponse;
        console.log("data-getted-message =>", data.message);
        this.selected = data.data;
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      } else {
        console.log("error =>", response.data);
      }
    },
  },
});

export default useTransactionStore;
