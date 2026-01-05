<script setup lang="ts">
import { formatCurrency } from "~/helpers";

const recentActivities = ref([
  {
    id: 1,
    type: "bet",
    user: "John Doe",
    description: "Pari placé sur PSG vs Real Madrid",
    amount: 150,
    time: "Il y a 5 min",
  },
  {
    id: 2,
    type: "transaction",
    user: "Jane Smith",
    description: "Dépôt effectué",
    amount: 500,
    time: "Il y a 12 min",
  },
  {
    id: 3,
    type: "user",
    user: "Mike Johnson",
    description: "Nouvel utilisateur inscrit",
    amount: 0,
    time: "Il y a 25 min",
  },
  {
    id: 4,
    type: "bet",
    user: "Sarah Williams",
    description: "Pari gagné - Barcelona vs Bayern",
    amount: 320,
    time: "Il y a 1h",
  },
]);

// Obtenir la couleur du type d'activité
const getActivityColor = (type: string) => {
  switch (type) {
    case "bet":
      return "primary";
    case "transaction":
      return "success";
    case "user":
      return "info";
    default:
      return "grey";
  }
};

// Obtenir l'icône du type d'activité
const getActivityIcon = (type: string) => {
  switch (type) {
    case "bet":
      return "mdi-chart-line";
    case "transaction":
      return "mdi-cash";
    case "user":
      return "mdi-account-plus";
    default:
      return "mdi-circle";
  }
};
</script>

<template>
  <!-- Graphique d'activité -->
  <v-card elevation="0" rounded="lg" class="border border-opacity">
    <v-card-title class="pa-4 d-flex align-center justify-space-between">
      <div>
        <h3 class="text-h6 font-weight-bold">Activité récente</h3>
        <p class="text-caption text-grey-darken-1 mb-0">
          Dernières actions sur la plateforme
        </p>
      </div>
      <v-btn variant="text" color="primary" size="small"> Voir tout </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <!-- <v-card-text class="pa-0">
        <v-list>
          <v-list-item
            v-for="activity in recentActivities"
            :key="activity.id"
            class="px-4 py-3"
          >
            <template v-slot:prepend>
              <v-avatar :color="getActivityColor(activity.type)" size="40">
                <v-icon
                  :icon="getActivityIcon(activity.type)"
                  color="white"
                ></v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium mb-1">
              {{ activity.user }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ activity.description }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <div class="text-right">
                <div
                  v-if="activity.amount > 0"
                  class="font-weight-bold text-success mb-1"
                  v-html="formatCurrency(activity.amount)"
                ></div>
                <div class="text-caption text-grey-darken-1">
                  {{ activity.time }}
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text> -->
    <v-card-text class="bg-grey-lighten-5">
      <div class="d-flex justify-center align-center flex-column pa-6">
        <v-icon icon="mdi-chart-line" color="grey-darken-1" size="170"></v-icon>
        <h6 class="text-body-1 font-weight-bold text-grey-darken-1 mt-2 mb-2">
          Aucune activité récente</h6>
      </div>
    </v-card-text>
  </v-card>
</template>
