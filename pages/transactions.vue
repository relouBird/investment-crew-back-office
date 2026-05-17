<!-- pages/dashboard/transactions.vue -->
<template>
  <ui-loader
    v-model="isLoading"
    :area="LoaderAreas.BODY"
    :text="`Chargement de vos transactions...`"
  >
    <div v-if="isLoading" class="loading-container">
      <v-row class="mt-8">
        <v-col cols="12">
          <v-skeleton-loader type="article" />
        </v-col>
        <v-col cols="12" md="6" lg="3" v-for="value in 4">
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>

      <v-skeleton-loader
        class="mx-auto border mt-7"
        type="table"
      ></v-skeleton-loader>
    </div>

    <v-container fluid class="pa-0" v-else>
      <div class="mb-6">
        <v-row class="d-flex align-center justify-space-between flex-wrap">
          <!-- Titre -->
          <v-col cols="12" md="6">
            <h1 class="text-h4 font-weight-bold text-primary">Transactions</h1>
          </v-col>

          <!-- Boutons -->
          <v-col cols="12" md="6" class="d-flex justify-end flex-wrap">
            <v-btn
              color="primary"
              class="mr-2"
              prepend-icon="mdi-plus"
              @click="showDepositDialog = true"
            >
              Dépôt
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              class=""
              prepend-icon="mdi-minus"
              @click="showWithdrawalDialog = true"
            >
              Retrait
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Balance Summary -->
      <v-row class="mb-6">
        <v-col
          cols="12"
          md="6"
          lg="3"
          v-for="balance in balanceSummary"
          :key="balance.title"
        >
          <v-card elevation="0" rounded="lg" border dark>
            <v-card-text
              class="text-center d-flex justify-start align-center ga-4"
            >
              <component
                size="52"
                :class="'text-' + balance.color"
                :is="balance.icon"
              />
              <div class="d-flex flex-column-reverse align-start">
                <p
                  class="text-h5 font-weight-bold"
                  :class="['text-' + balance.color]"
                >
                  {{ balance.amount }}
                  &#x244;

                  <span v-if="balance.percentage" class="text-caption">
                    {{ balance.percentage }}
                  </span>
                </p>
                <div class="text-subtitle-1">{{ balance.title }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Transactions Table -->
      <v-card elevation="0" rounded="lg" class="border">
        <v-card-title class="text-h6 font-montserrat">
          <span>Historique des transactions</span>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Rechercher"
            variant="outlined"
            single-line
            hide-details
            density="compact"
            class="mt-2"
            style="max-width: 300px"
          ></v-text-field
        ></v-card-title>
        <v-data-table
          :headers="transactionHeaders"
          :items="transactions"
          :search="search"
          class="elevation-0"
        >
          <template v-slot:item.date="{ item }">
            <p>{{ formatDate(item.created_at) }}</p>
          </template>
          <template v-slot:item.type="{ item }">
            <v-chip :color="getTransactionColor(item.type)" size="small">
              <component size="16" :is="getTransactionIcon(item.type)" />
              <span class="pl-1">{{ getTransactionLabel(item.type) }}</span>
            </v-chip>
          </template>
          <template v-slot:item.amount="{ item }">
            <span
              :class="getAmountClass(item.type)"
              v-html="getAmountSign(item.type) + formatCurrency(item.amount)"
            >
            </span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>

      <!-- Deposit Dialog -->
      <wallets-deposit-dialog v-model:model-value="showDepositDialog" />
      <wallets-withdrawal-dialog v-model:model-value="showWithdrawalDialog" />
    </v-container>
  </ui-loader>
</template>

<script setup lang="ts">
import { LoaderAreas } from "~/constants";

import {
  CreditCardIcon,
  CircleXIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  Receipt2Icon,
} from "vue-tabler-icons";
import { formatCurrency, formatDate } from "~/helpers";
import {
  type AdminTransactionStats,
  type EvolutionData,
  type TransactionModel,
} from "~/types/transaction.type";
import transactionComposable from "~/composables/transaction-handler";
import useWalletStore from "~/stores/wallet.store";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// Meta tags
useSeoHead({
  title: "Transactions",
  subtitle: "Historique de vos transactions",
  forcePrefix: true,
});

// Stores
const walletStore = useWalletStore();

// Valeurs réactives...
const transactions = computed(() =>
  walletStore.getStatitics?.transactions
    ? walletStore.getStatitics.transactions
    : ([] as TransactionModel[]),
);
const balance = computed(() => walletStore.getStatitics?.balance ?? 0);

const evolution = computed(() =>
  walletStore.getStatitics?.evolution
    ? walletStore.getStatitics.evolution
    : ({} as EvolutionData),
);
const transactionStats = computed(() =>
  walletStore.getStatitics?.transactionStats
    ? walletStore.getStatitics.transactionStats
    : ({} as AdminTransactionStats),
);
const isLoading = ref<boolean>(false);
const search = ref("");
const showDepositDialog = ref(false);
const showWithdrawalDialog = ref(false);

const {
  // Getters
  getTransactionColor,
  getTransactionIcon,
  getTransactionLabel,
  getAmountClass,
  getAmountSign,
  getStatusColor,
  getStatusLabel,
} = transactionComposable();

const balanceSummary = [
  {
    title: "Solde disponible",
    amount: balance.value,
    icon: CreditCardIcon,
    color: "primary",
  },
  {
    title: "Total Déposé",
    amount: transactionStats.value.totalDeposits,
    icon: Receipt2Icon,
    color: "warning",
  },
  {
    title: "Gains sur Match",
    amount: transactionStats.value.totalWins,
    icon: evolution.value.digit >= 0 ? TrendingUpIcon : TrendingDownIcon,
    color: evolution.value.digit >= 0 ? "success" : "error",
    percentage: evolution.value.percentage,
  },
  {
    title: "Perte sur Match",
    amount: transactionStats.value.totalLoss,
    icon: CircleXIcon,
    color: "error",
  },
];

const transactionHeaders = [
  { title: "Date", key: "date" },
  { title: "Type", key: "type" },
  { title: "Description", key: "description" },
  { title: "Montant", key: "amount" },
  { title: "Statut", key: "status" },
];

// Utilitaires pour l'affichage
const loadTransactions = async () => {
  try {
    isLoading.value = true;
    await walletStore.getSummaryWalletData();
  } catch (e) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // load les users
  await loadTransactions();
});
</script>
