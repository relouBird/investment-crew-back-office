<script setup lang="ts">

import useUserBetStore from "~/stores/bet-users.store";
import useBetStore from "~/stores/bet.store";
import useSponsoringStore from "~/stores/sponsoring.store";
import useTransactionStore from "~/stores/transaction.store";
import useUserStore from "~/stores/users.store";
import useWalletStore from "~/stores/wallet.store";

import { LoaderAreas } from "~/constants";

// Définir le layout à utiliser
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// Meta tags
useSeoHead({
  title: "Bienvenue",
  subtitle: "Bienvenue sur notre plateforme",
  forcePrefix: true,
});

//store
const walletStore = useWalletStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const sponsoringStore = useSponsoringStore();
const betStore = useBetStore();
const userBetStore = useUserBetStore();

// Données réactives...
const isLoading = ref<boolean>(false);

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    userStore.fetch(),
    betStore.fetch(),
    userBetStore.fetch(),
    transactionStore.fetch(),
  ])
    .then((values) => {
      console.log(values);
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    })
    .catch((reason) => {
      console.log("Reasons ===>", reason);
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    });
});
</script>

<template>
  <ui-loader
    v-model="isLoading"
    :area="LoaderAreas.BODY"
    :text="`Chargement de vos données...`"
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

      <v-row>
        <v-col cols="12" md="6" lg="6" v-for="value in 2">
          <v-skeleton-loader
            class="mx-auto border mt-7"
            type="table"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <v-container fluid class="pa-0" v-else>
      <div class="dashboard-container">
        <!-- En-tête -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">Bienvenue Admin 👋</h1>
          <p class="text-grey-darken-1">Voici un aperçu de votre plateforme</p>
        </div>

        <!-- Statistiques principales -->
        <DashboardStatistics />

        <!-- Graphiques et Top Matchs -->
        <v-row class="mb-6">
          <!-- Graphique d'activité -->
          <v-col cols="12" md="6">
            <DashboardRecentsActivities />
          </v-col>

          <!-- Top Matchs -->
          <v-col cols="12" md="6">
            <DashboardTopMatches />
          </v-col>
        </v-row>

        <!-- Actions en attente et Accès rapides -->
        <v-row>
          <!-- Actions en attente -->
          <v-col cols="12" md="6">
            <DashboardPendingActions />
          </v-col>

          <!-- Accès rapides -->
          <v-col cols="12" md="6">
            <DashboardQuickActions />
          </v-col>
        </v-row>
      </div>
    </v-container>
  </ui-loader>
</template>

<style scoped>
.dashboard-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}


@media (max-width: 960px) {
  .dashboard-container {
    padding: 16px;
  }
}
</style>
