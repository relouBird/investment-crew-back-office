<script setup lang="ts">
import useBetStore from "~/stores/bet.store";
import { LoaderAreas } from "~/constants";
import type { BetModel } from "~/types/api-bet.type";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// // Stores
const betStore = useBetStore();

const betsActive = computed(() => {
  let datas = betStore.getBets;
  let bets: BetModel[] = [];

  if (datas.length) {
    datas.forEach((bet) => {
      const now = new Date();
      const endDate = new Date(bet.end_at);
      if (now < endDate && !bet.isEnded) {
        bets.push(bet);
      }
    });
  }

  return bets;
});

const betsPast = computed(() => {
  let datas = betStore.getBets;
  let bets: BetModel[] = [];

  if (datas.length) {
    datas.forEach((bet) => {
      const now = new Date();
      const endDate = new Date(bet.end_at);
      if (now > endDate) {
        bets.push(bet);
      } else if (bet.isEnded) {
        bets.push(bet);
      }
    });
  }

  return bets;
});
const isLoading = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const actions = ref<{ action: string; bet: BetModel | undefined }>({
  action: "",
  bet: undefined,
});

const selectedTab = ref("active");

const completedBetsHeaders = [
  { title: "Match", key: "match" },
  { title: "Prédiction", key: "prediction" },
  { title: "Mise", key: "stake" },
  { title: "Statut", key: "status" },
  { title: "Résultat", key: "result" },
  { title: "Date", key: "date" },
];

const completedBets = [
  {
    match: "PSG vs Real Madrid",
    prediction: "PSG gagne",
    stake: "€100",
    status: "won",
    result: "+€150",
    date: "2024-07-18",
  },
  // ... more completed bets
];

// Méthodes...
const loadBets = async () => {
  try {
    isLoading.value = true;
    await betStore.fetch();
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadBets();
});

watch(
  () => actions.value,
  (newValue) => {
    if (newValue.action != "" && newValue.bet) {
      console.log("actions: ", newValue.action, ", bet-id: ", newValue.bet.id);
      if (newValue.action == "update-session") {
        isEditing.value = true;
      }
      betStore.selected = newValue.bet;
    }
  }
);
</script>

<!-- pages/dashboard/bets.vue -->
<template>
  <ui-loader
    v-model="isLoading"
    :area="LoaderAreas.BODY"
    :text="`Chargement de vos paris...`"
  >
    <div v-if="isLoading" class="loading-container">
      <v-row class="mt-0">
        <v-col cols="12">
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12" lg="4" md="6" v-for="value in 6">
          <v-skeleton-loader
            class="mx-auto border"
            type="image, article, article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <v-container fluid class="pa-0" v-else>
      <div class="mb-6">
        <v-row class="d-flex align-center justify-space-between flex-wrap">
          <!-- Titre -->
          <v-col cols="12" md="6" class="">
            <h1 class="text-h4 font-weight-bold text-primary">
              Tout Mes Paris
            </h1>
          </v-col>

          <!-- Boutons -->
          <v-col cols="12" md="6" class="d-flex justify-end flex-wrap">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/bets/new')"
            >
              Nouveau Pari
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Tabs for bet status -->
      <v-tabs v-model="selectedTab" color="primary" class="mb-6">
        <v-tab value="active">Paris Actifs ({{ betsActive.length }})</v-tab>
        <v-tab value="completed">Paris Terminés ({{ betsPast.length }})</v-tab>
        <v-tab value="users">Paris Utilisateurs </v-tab>
      </v-tabs>

      <v-window v-model="selectedTab">
        <v-window-item value="active">
          <bet-items v-model:model-value="actions" :bets="betsActive" />
        </v-window-item>

        <v-window-item value="completed">
          <bet-items v-model:model-value="actions" :bets="betsPast" />
        </v-window-item>

        <v-window-item value="users">
          <v-card elevation="0" class="border border-opacity" rounded="lg">
            <v-card-title class="font-montserrat"
              >Historique des paris</v-card-title
            >
            <v-data-table
              :headers="completedBetsHeaders"
              :items="completedBets"
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'won' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.status === "won" ? "Gagné" : "Perdu" }}
                </v-chip>
              </template>
              <template v-slot:item.result="{ item }">
                <span
                  :class="item.status === 'won' ? 'text-success' : 'text-error'"
                >
                  {{ item.result }}
                </span>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>

    <BetDeleteDialog v-model:model-value="actions.action" />
    <BetUpdateDialog
      :bet-selected="actions.bet"
      v-model:model-value="isEditing"
      v-if="actions.bet"
    />
  </ui-loader>
</template>
