<script setup lang="ts">
import { formatDate } from "~/helpers";
import { ClockIcon, CalendarIcon } from "vue-tabler-icons";
import type { MatchModel } from "~/types/api-bet.type";
import useBetApiStore from "~/stores/bet-api.store";

type StateType = {
  isLoading: boolean;
  matches: Record<string, MatchModel[]>;
};

// Store
const betApiStore = useBetApiStore();

const props = defineProps<StateType>();

const emit = defineEmits<{
  "match-click": [match: MatchModel];
}>();

function handleOpenModal(match: MatchModel) {
  betApiStore.updateSelectedMatch(match);
  emit("match-click", match);
}

// Obtenir le badge de statut
const getStatusBadge = (status: string) => {
  switch (status) {
    case "FINISHED":
      return { color: "grey", text: "Terminé" };
    case "LIVE":
    case "IN_PLAY":
      return { color: "error", text: "En cours" };
    case "SCHEDULED":
    case "TIMED":
      return { color: "primary", text: "À venir" };
    case "POSTPONED":
      return { color: "warning", text: "Reporté" };
    default:
      return { color: "grey", text: status };
  }
};
</script>
<template>
  <!-- Loading -->
  <div v-if="isLoading" class="text-center py-12">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <p class="text-grey-darken-1 mt-4">Chargement des matchs...</p>
  </div>

  <!-- Liste des matchs groupés par date -->
  <div v-else>
    <div v-for="(matchList, date) in matches" :key="date" class="mb-6">
      <!-- En-tête de date -->
      <div class="date-header mb-4">
        <div class="date-icon-wrapper">
          <CalendarIcon :size="22" stroke-width="2" />
        </div>
        <h3 class="date-title">
          {{ date }}
        </h3>
      </div>

      <v-row>
        <v-col
          v-for="match in matchList"
          :key="match.id"
          cols="12"
          sm="6"
          md="6"
          lg="6"
        >
          <!-- Cartes de matchs -->
          <v-card
            class="mb-3 match-card border-sm"
            elevation="0"
            rounded="lg"
            hover
            @click="handleOpenModal(match)"
          >
            <v-card-text class="pa-4">
              <v-row align="center">
                <!-- Date et heure -->
                <v-col cols="12" sm="3" class="text-center">
                  <div class="match-time">
                    <div class="text-caption text-grey-darken-1">
                      {{ formatDate(match.utcDate, "DD MMM") }}
                    </div>
                    <div class="d-flex align-center justify-center my-2">
                      <ClockIcon :size="20" class="text-primary mr-1" />
                      <span class="text-h6 font-weight-bold text-primary">
                        {{ formatDate(match.utcDate, "HH:mm") }}
                      </span>
                    </div>
                    <v-chip
                      size="x-small"
                      :color="getStatusBadge(match.status).color"
                      variant="flat"
                      class="mt-1"
                    >
                      {{ getStatusBadge(match.status).text }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Équipes -->
                <v-col cols="12" sm="9">
                  <div class="d-flex align-center justify-space-between">
                    <!-- Équipe domicile -->
                    <div class="d-flex align-center flex-grow-1">
                      <v-avatar size="40" class="mr-3">
                        <v-img
                          :src="match.homeTeam.crest"
                          :alt="match.homeTeam.name"
                        ></v-img>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="font-weight-medium">
                          {{ match.homeTeam.name }}
                        </div>
                        <div class="text-caption text-grey-darken-1">
                          {{ match.homeTeam.tla }}
                        </div>
                      </div>
                      <div
                        v-if="match.score.fullTime.home !== null"
                        class="text-h5 font-weight-bold mx-4"
                      >
                        {{ match.score.fullTime.home }}
                      </div>
                    </div>

                    <!-- VS -->
                    <div class="mx-4 text-grey-darken-1 font-weight-medium">
                      VS
                    </div>

                    <!-- Équipe extérieure -->
                    <div
                      class="d-flex align-center flex-grow-1 flex-row-reverse"
                    >
                      <v-avatar size="40" class="ml-3">
                        <v-img
                          :src="match.awayTeam.crest"
                          :alt="match.awayTeam.name"
                        ></v-img>
                      </v-avatar>
                      <div class="flex-grow-1 text-right">
                        <div class="font-weight-medium">
                          {{ match.awayTeam.name }}
                        </div>
                        <div class="text-caption text-grey-darken-1">
                          {{ match.awayTeam.tla }}
                        </div>
                      </div>
                      <div
                        v-if="match.score.fullTime.away !== null"
                        class="text-h5 font-weight-bold mx-4"
                      >
                        {{ match.score.fullTime.away }}
                      </div>
                    </div>
                  </div>

                  <!-- Infos match -->
                  <div class="d-flex align-center mt-2">
                    <v-chip size="x-small" variant="text" class="mr-2">
                      <TrophyIcon :size="14" class="mr-1" />
                      Journée {{ match.matchday }}
                    </v-chip>
                    <v-chip v-if="match.stage" size="x-small" variant="text">
                      {{ match.stage }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Message si aucun match -->
    <v-alert
      v-if="Object.keys(matches).length === 0"
      type="info"
      variant="tonal"
      class="text-center"
    >
      Aucun match disponible pour cette compétition
    </v-alert>
  </div>
</template>

<style scoped>
.match-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.match-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.match-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-primary), 0.03) 100%
  );
  border-radius: 12px;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.date-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgb(var(--v-theme-primary));
  border-radius: 10px;
  color: white;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

.date-title {
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

@media (max-width: 600px) {
  .match-time {
    margin-bottom: 16px;
  }
}
</style>
