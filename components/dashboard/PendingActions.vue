<script setup lang="ts">
import { computed, ref } from "vue";
import { AlertCircleIcon, ClockIcon } from "vue-tabler-icons";
import { formatCurrency } from "~/helpers";

const now = Date.now();

const pendingActions = ref([
  {
    id: 1,
    user: "Alex Martin",
    amount: 1200,
    requestedAt: "2026-01-02T10:30:00Z",
  },
  // {
  //   id: 2,
  //   user: "Emma Brown",
  //   amount: 450,
  //   requestedAt: "2026-01-04T09:00:00Z",
  // },
  // {
  //   id: 3,
  //   user: "Chris Wilson",
  //   amount: 3000,
  //   requestedAt: "2025-12-30T18:15:00Z",
  // },
]);

// Calcul des jours écoulés
const daysBetween = (date: string) => {
  const diff = now - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Déterminer l’urgence
const getUrgency = (date: string) => {
  const days = daysBetween(date);

  if (days > 3) return "urgent";
  if (days >= 1) return "watch";
  return "normal";
};

const getUrgencyLabel = (date: string) => {
  const urgency = getUrgency(date);
  if (urgency === "urgent") return "Urgent";
  if (urgency === "watch") return "À surveiller";
  return "Normal";
};

const getUrgencyColor = (date: string) => {
  const urgency = getUrgency(date);
  if (urgency === "urgent") return "error";
  if (urgency === "watch") return "warning";
  return "success";
};
</script>

<template>
  <v-card elevation="0" rounded="lg" class="border border-opacity" disabled>
    <!-- Header -->
    <v-card-title class="pa-4 d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <AlertCircleIcon size="22" class="text-warning mr-2" />
        <div>
          <h3 class="text-h6 font-weight-bold">Retraits en attente</h3>
          <p class="text-caption text-grey-darken-1 mb-0">
            {{ pendingActions.length }} demandes à traiter
          </p>
        </div>
      </div>
    </v-card-title>

    <v-divider />

    <!-- List -->
    <v-card-text class="pa-4">
      <div
        v-for="action in pendingActions"
        :key="action.id"
        class="pending-item pa-3 rounded-lg mb-3"
      >
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="font-weight-semibold">{{ action.user }}</div>

            <div class="text-caption text-grey-darken-1 mt-1">
              Retrait de
              <strong v-html="formatCurrency(action.amount)"></strong>
            </div>

            <div class="d-flex align-center text-caption mt-1">
              <ClockIcon size="14" class="mr-1" />
              Il y a {{ daysBetween(action.requestedAt) }} jour(s)
            </div>
          </div>

          <v-chip
            size="small"
            variant="flat"
            :color="getUrgencyColor(action.requestedAt)"
          >
            {{ getUrgencyLabel(action.requestedAt) }}
          </v-chip>
        </div>

        <div class="d-flex justify-end">
          <v-btn size="small" variant="outlined" class="text-none" rounded="xl"> Voir détails </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.pending-item {
  background: rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
