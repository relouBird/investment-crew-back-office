<script setup lang="ts">
import type { TeamModel } from "~/types/api-bet.type";

type StateType = {
  isLoading: boolean;
  teams: TeamModel[];
  selectedTeams?: TeamModel[];
};

const props = defineProps<StateType>();

const emit = defineEmits<{
  "team-select": [teams: TeamModel[]];
}>();

const localSelectedTeams = ref<TeamModel[]>(props.selectedTeams || []);

function handleTeamClick(team: TeamModel) {
  const index = localSelectedTeams.value.findIndex(t => t.id === team.id);
  
  if (index !== -1) {
    // Désélectionner l'équipe
    localSelectedTeams.value.splice(index, 1);
  } else {
    // Sélectionner l'équipe (max 2)
    if (localSelectedTeams.value.length < 2) {
      localSelectedTeams.value.push(team);
    } else {
      // Remplacer la première équipe sélectionnée
      localSelectedTeams.value.shift();
      localSelectedTeams.value.push(team);
    }
  }
  
  emit("team-select", localSelectedTeams.value);
}

function isTeamSelected(teamId: number): boolean {
  return localSelectedTeams.value.some(t => t.id === teamId);
}

function getSelectionOrder(teamId: number): number | null {
  const index = localSelectedTeams.value.findIndex(t => t.id === teamId);
  return index !== -1 ? index + 1 : null;
}
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
    <!-- Indicateur de sélection -->
    <v-alert
      color="primary"
      variant="tonal"
      class="mb-4"
      density="compact"
    >
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          <span class="font-weight-medium">
            {{ localSelectedTeams.length }} équipe{{ localSelectedTeams.length > 1 ? 's' : '' }} sélectionnée{{ localSelectedTeams.length > 1 ? 's' : '' }}
          </span>
        </div>
        <span class="text-caption">
          {{ localSelectedTeams.length === 2 ? 'Prêt à créer le pari' : 'Sélectionnez une autre équipe' }}
        </span>
      </div>
    </v-alert>

    <v-row>
      <v-col
        v-for="team in teams"
        :key="team.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <!-- Carte d'équipe compacte -->
        <v-card
          :class="['team-card', { 'team-selected': isTeamSelected(team.id) }]"
          elevation="0"
          rounded="lg"
          hover
          @click="handleTeamClick(team)"
        >
          <!-- Badge de sélection -->
          <div v-if="isTeamSelected(team.id)" class="selection-badge">
            <v-avatar color="success" size="24">
              <span class="text-white text-caption font-weight-bold">
                {{ getSelectionOrder(team.id) }}
              </span>
            </v-avatar>
          </div>

          <v-card-text class="pa-3 text-center">
            <!-- Logo de l'équipe -->
            <v-avatar size="60" color="grey-lighten-4" class="mb-2">
              <v-img
                :src="team.crest"
                :alt="team.name"
                cover
              ></v-img>
            </v-avatar>

            <!-- Nom de l'équipe -->
            <h4 class="text-body-2 font-weight-bold mb-1 team-name">
              {{ team.shortName || team.name }}
            </h4>
            
            <!-- TLA -->
            <div class="text-caption text-grey-darken-1 mb-2">
              {{ team.tla }}
            </div>

            <!-- Stade -->
            <div v-if="team.venue" class="d-flex align-center justify-center">
              <v-icon size="12" color="grey-darken-1" class="mr-1">
                mdi-stadium
              </v-icon>
              <span class="text-caption text-grey-darken-2">
                {{ team.venue.length > 20 ? team.venue.substring(0, 20) + '...' : team.venue }}
              </span>
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
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.08);
  position: relative;
  height: 100%;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.team-card.team-selected {
  border-color: rgb(var(--v-theme-success));
  background: linear-gradient(145deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-success), 0.02) 100%);
}

.team-card.team-selected:hover {
  border-color: rgb(var(--v-theme-success));
}

.selection-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.team-name {
  line-height: 1.2;
  min-height: 2.4em;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>