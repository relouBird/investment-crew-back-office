<script setup lang="ts"></script>

<template>
  <v-card elevation="0" rounded="lg" class="border border-opacity">
    <v-card-title class="pa-4">
      <div>
        <h3 class="text-h6 font-weight-bold">Accès rapides</h3>
        <p class="text-caption text-grey-darken-1 mb-0">Actions fréquentes</p>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <v-row>
        <!-- Créer un match -->
        <v-col cols="6">
          <v-card
            class="quick-action-card"
            variant="tonal"
            color="primary"
            to="/bets/new"
          >
            <v-card-text class="text-center pa-4">
              <v-icon size="40" class="mb-2">mdi-plus-circle</v-icon>
              <div class="text-body-2 font-weight-bold">Créer un match</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Gerer les utilisateurs -->
        <v-col cols="6">
          <v-card
            class="quick-action-card"
            variant="tonal"
            color="success"
            to="/users"
          >
            <v-card-text class="text-center pa-4">
              <v-icon size="40" class="mb-2">mdi-account-multiple-plus</v-icon>
              <div class="text-body-2 font-weight-bold">Gérer utilisateurs</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Voir les transactions -->
        <v-col cols="6">
          <v-card
            class="quick-action-card"
            variant="tonal"
            color="warning"
            to="/transactions"
          >
            <v-card-text class="text-center pa-4">
              <v-icon size="40" class="mb-2">mdi-swap-horizontal</v-icon>
              <div class="text-body-2 font-weight-bold">Transactions</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Voir les paris -->
        <v-col cols="6">
          <v-card
            class="quick-action-card"
            variant="tonal"
            color="error"
            to="/bets"
          >
            <v-card-text class="text-center pa-4">
              <v-icon size="40" class="mb-2">mdi-chart-bar</v-icon>
              <div class="text-body-2 font-weight-bold">Voir les paris</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.quick-action-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>
