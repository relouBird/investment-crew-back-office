<script setup lang="ts">
import { TrophyIcon } from "vue-tabler-icons";
import useBetApiStore from "~/stores/bet-api.store";
import type { CompetitionModel } from "~/types/api-bet.type";

// Store
const betApiStore = useBetApiStore();

type StateType = {
  isLoading: boolean;
  competitions: CompetitionModel[];
};

const props = defineProps<StateType>();

// Méthodes
const setActiveCompetition = (competition: CompetitionModel) => {
  betApiStore.updateSelectedCompetition(competition);
};
</script>
<template>
  <!-- Liste des compétitions -->
  <!-- Loading -->
  <div v-if="isLoading" class="text-center py-12">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <p class="text-grey-darken-1 mt-4">Chargement des compétitions...</p>
  </div>

  <!-- Grille des compétitions -->
  <v-row v-else>
    <v-col
      v-for="competition in competitions"
      :key="competition.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      v-if="competitions.length"
    >
      <v-card
        hover
        class="competition-card border-sm"
        @click="setActiveCompetition(competition)"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-6">
          <div class="d-flex flex-column align-center text-center">
            <!-- Emblème de la compétition avec effet -->
            <div class="competition-emblem-wrapper mb-4">
              <div class="competition-emblem">
                <img
                  v-if="competition.emblem"
                  :src="competition.emblem"
                  :alt="competition.name"
                  class="emblem-img"
                />
                <div v-else class="emblem-placeholder">
                  <TrophyIcon :size="48" stroke-width="1.5" />
                </div>
              </div>
            </div>

            <!-- Nom de la compétition -->
            <h3 class="text-h6 font-weight-bold mb-3 competition-name">
              {{ competition.name }}
            </h3>

            <!-- Région/Pays avec flag -->
            <div class="d-flex align-center justify-center mb-3">
              <div v-if="competition.area?.flag" class="flag-wrapper mr-2">
                <v-avatar size="25">
                  <v-img
                    :src="competition.area.flag"
                    :alt="competition.area.name"
                    cover
                    class="flag-img"
                  />
                </v-avatar>
              </div>
              <span class="text-body-2 text-grey-darken-2">
                {{ competition.area?.name || "International" }}
              </span>
            </div>

            <!-- Infos supplémentaires -->
            <div class="d-flex flex-column align-center gap-2 w-100">
              <v-chip
                size="small"
                :color="competition.type === 'LEAGUE' ? 'primary' : 'secondary'"
                variant="flat"
                class="px-4"
              >
                {{ competition.type }}
              </v-chip>

              <div
                v-if="competition.currentSeason"
                class="d-flex align-center justify-center mt-1"
              >
                <v-icon size="16" color="grey-darken-1" class="mr-1">
                  mdi-calendar-clock
                </v-icon>
                <span
                  class="text-caption text-grey-darken-1 font-weight-medium"
                >
                  Journée {{ competition.currentSeason.currentMatchday }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.competition-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  /* border: 1px solid rgba(0, 0, 0, 0.05); */
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
  position: relative;
  overflow: hidden;
}

.competition-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.competition-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.competition-card:hover::before {
  opacity: 1;
}

.competition-emblem-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.competition-emblem {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #f5f5f5, #ffffff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  padding: 16px;
}

.competition-card:hover .competition-emblem {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.emblem-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emblem-placeholder {
  color: #9e9e9e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.competition-name {
  line-height: 1.3;
  min-height: 2.6em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
