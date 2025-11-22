<script setup lang="ts">
import { ShieldIcon, CalendarIcon, UsersIcon } from "vue-tabler-icons";
import type { TeamModel } from "~/types/api-bet.type";

type StateType = {
  isLoading: boolean;
  teams: TeamModel[];
};

const props = defineProps<StateType>();

const emit = defineEmits<{
  "team-click": [team: TeamModel];
}>();

function handleTeamClick(team: TeamModel) {
  emit("team-click", team);
}

// Obtenir les couleurs du club formatées
const getClubColors = (colors: string) => {
  if (!colors) return [];
  return colors.split('/').map(c => c.trim()).slice(0, 3);
};

// Formater l'année de fondation
const getFoundedText = (founded: number) => {
  const years = new Date().getFullYear() - founded;
  return `Fondé en ${founded} (${years} ans)`;
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
    <p class="text-grey-darken-1 mt-4">Chargement des équipes...</p>
  </div>

  <!-- Liste des équipes -->
  <div v-else>
    <v-row>
      <v-col
        v-for="team in teams"
        :key="team.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <!-- Carte d'équipe -->
        <v-card
          class="team-card"
          elevation="0"
          rounded="lg"
          hover
          @click="handleTeamClick(team)"
        >
          <v-card-text class="pa-5">
            <div class="d-flex flex-column align-center text-center">
              <!-- Logo de l'équipe avec effet -->
              <div class="team-crest-wrapper mb-3">
                <div class="team-crest">
                  <v-img
                    :src="team.crest"
                    :alt="team.name"
                    width="80"
                    height="80"
                    cover
                  ></v-img>
                </div>
              </div>

              <!-- Nom de l'équipe -->
              <h3 class="text-h6 font-weight-bold mb-1 team-name">
                {{ team.name }}
              </h3>
              <div class="text-caption text-grey-darken-1 mb-3">
                {{ team.tla }}
              </div>

              <!-- Drapeau du pays -->
              <div v-if="team.area?.flag" class="d-flex align-center justify-center mb-3">
                <div class="flag-wrapper mr-2">
                  <img
                    :src="team.area.flag"
                    :alt="team.area.name"
                    class="flag-img"
                  />
                </div>
                <span class="text-caption text-grey-darken-2">
                  {{ team.area.name }}
                </span>
              </div>

              <!-- Couleurs du club -->
              <div v-if="team.clubColors" class="d-flex align-center justify-center gap-1 mb-4">
                <v-tooltip
                  v-for="(color, index) in getClubColors(team.clubColors)"
                  :key="index"
                  :text="color"
                  location="top"
                >
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      class="color-dot"
                      :style="{ backgroundColor: color.toLowerCase() }"
                    ></div>
                  </template>
                </v-tooltip>
              </div>

              <!-- Informations supplémentaires -->
              <v-divider class="my-3 w-100"></v-divider>

              <div class="w-100">
                <!-- Stade -->
                <div v-if="team.venue" class="info-item mb-2">
                  <v-icon size="16" color="grey-darken-1" class="mr-2">
                    mdi-stadium
                  </v-icon>
                  <span class="text-caption text-grey-darken-2">
                    {{ team.venue }}
                  </span>
                </div>

                <!-- Année de fondation -->
                <div v-if="team.founded" class="info-item mb-2">
                  <CalendarIcon :size="16" class="text-grey-darken-1 mr-2" />
                  <span class="text-caption text-grey-darken-2">
                    {{ getFoundedText(team.founded) }}
                  </span>
                </div>

                <!-- Effectif -->
                <div v-if="team.squad?.length" class="info-item">
                  <UsersIcon :size="16" class="text-grey-darken-1 mr-2" />
                  <span class="text-caption text-grey-darken-2">
                    {{ team.squad.length }} joueurs
                  </span>
                </div>
              </div>

              <!-- Compétitions actives -->
              <div v-if="team.runningCompetitions?.length > 0" class="w-100 mt-3">
                <v-divider class="mb-3"></v-divider>
                <div class="text-caption text-grey-darken-1 mb-2 font-weight-medium">
                  Compétitions actives
                </div>
                <div class="d-flex flex-wrap gap-1 justify-center">
                  <v-chip
                    v-for="comp in team.runningCompetitions.slice(0, 2)"
                    :key="comp.id"
                    size="x-small"
                    color="primary"
                    variant="flat"
                  >
                    {{ comp.code || comp.name }}
                  </v-chip>
                  <v-chip
                    v-if="team.runningCompetitions.length > 2"
                    size="x-small"
                    color="grey"
                    variant="flat"
                  >
                    +{{ team.runningCompetitions.length - 2 }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message si aucune équipe -->
    <v-alert
      v-if="teams.length === 0"
      type="info"
      variant="tonal"
      class="text-center"
    >
      Aucune équipe disponible
    </v-alert>
  </div>
</template>

<style scoped>
.team-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
  position: relative;
  overflow: hidden;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.team-card:hover::before {
  opacity: 1;
}

.team-crest-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-crest {
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

.team-card:hover .team-crest {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.team-name {
  line-height: 1.3;
  min-height: 2.6em;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flag-wrapper {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.flag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-dot:hover {
  transform: scale(1.2);
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gap-1 {
  gap: 4px;
}

.w-100 {
  width: 100%;
}
</style>