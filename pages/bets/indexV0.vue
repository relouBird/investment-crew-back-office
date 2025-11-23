<script setup lang="ts">
import { ClockIcon, TrophyIcon, UsersIcon } from "vue-tabler-icons";
import { formatDate } from "~/helpers";
import useBetStore from "~/stores/bet.store";
import type { BetModel } from "~/types/api-bet.type";

// type StateType = {
//   bets: BetModel[];
//   isLoading: boolean;
// };

// const props = defineProps<StateType>();

const betStore = useBetStore();

const bets = computed(()=> betStore.getPrototypes);
const isLoading = ref<boolean>(false);

const emit = defineEmits<{
  "bet-click": [bet: BetModel];
  "edit-bet": [bet: BetModel];
  "toggle-status": [bet: BetModel];
  "end-bet": [bet: BetModel];
  "delete-bet": [bet: BetModel];
}>();

// Obtenir le statut du pari
const getBetStatus = (bet: BetModel) => {
  if (bet.isEnded) {
    return { text: 'Terminé', color: 'grey', icon: 'mdi-flag-checkered' };
  }
  if (!bet.isActive) {
    return { text: 'Inactif', color: 'warning', icon: 'mdi-pause-circle' };
  }
  const now = new Date();
  const endDate = new Date(bet.end_at);
  if (now > endDate) {
    return { text: 'Expiré', color: 'error', icon: 'mdi-clock-alert' };
  }
  return { text: 'Actif', color: 'success', icon: 'mdi-check-circle' };
};

// Obtenir le score formaté
const getScoreDisplay = (score: string) => {
  if (!score || score === '-') return null;
  return score;
};


// Calculer le temps restant
const getTimeRemaining = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expiré';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return 'Moins d\'1h';
};

function handleBetClick(bet: BetModel) {
  emit("bet-click", bet);
}

function handleEdit(bet: BetModel, event: Event) {
  event.stopPropagation();
  emit("edit-bet", bet);
}

function handleToggleStatus(bet: BetModel, event: Event) {
  event.stopPropagation();
  emit("toggle-status", bet);
}

function handleEndBet(bet: BetModel, event: Event) {
  event.stopPropagation();
  emit("end-bet", bet);
}

function handleDelete(bet: BetModel, event: Event) {
  event.stopPropagation();
  emit("delete-bet", bet);
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
    <p class="text-grey-darken-1 mt-4">Chargement des paris...</p>
  </div>

  <!-- Liste des paris -->
  <div v-else>
    <v-row>
      <v-col
        v-for="bet in bets"
        :key="bet.id"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card
          class="admin-bet-card"
          elevation="0"
          rounded="lg"
          hover
          @click="handleBetClick(bet)"
        >
          <!-- En-tête avec statut et actions -->
          <div class="card-header pa-3 d-flex justify-space-between align-center">
            <v-chip
              :color="getBetStatus(bet).color"
              size="small"
              variant="flat"
              :prepend-icon="getBetStatus(bet).icon"
            >
              {{ getBetStatus(bet).text }}
            </v-chip>

            <!-- Menu actions -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  @click.stop
                ></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="handleEdit(bet, $event)" prepend-icon="mdi-pencil">
                  <v-list-item-title>Modifier</v-list-item-title>
                </v-list-item>
                <v-list-item 
                  v-if="!bet.isEnded"
                  @click="handleToggleStatus(bet, $event)" 
                  :prepend-icon="bet.isActive ? 'mdi-pause' : 'mdi-play'"
                >
                  <v-list-item-title>
                    {{ bet.isActive ? 'Désactiver' : 'Activer' }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item 
                  v-if="!bet.isEnded"
                  @click="handleEndBet(bet, $event)" 
                  prepend-icon="mdi-flag-checkered"
                >
                  <v-list-item-title>Terminer</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item 
                  @click="handleDelete(bet, $event)" 
                  prepend-icon="mdi-delete"
                  class="text-error"
                >
                  <v-list-item-title>Supprimer</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-card-text class="pa-4">
            <!-- ID du pari -->
            <div class="text-caption text-grey-darken-1 mb-3">
              ID: #{{ bet.id }}
            </div>

            <!-- Équipes -->
            <div class="teams-container mb-3">
              <!-- Équipe domicile -->
              <div class="team-section">
                <v-avatar size="50" color="grey-lighten-4" class="mb-2">
                  <v-img :src="bet.homeTeam.crest" :alt="bet.homeTeam.name"></v-img>
                </v-avatar>
                <div class="text-body-2 font-weight-bold text-center team-name">
                  {{ bet.homeTeam.tla }}
                </div>
                <div class="text-caption text-grey-darken-1 text-center">
                  {{ bet.homeTeam.name }}
                </div>
              </div>

              <!-- VS ou Score -->
              <div class="vs-section">
                <div v-if="getScoreDisplay(bet.score)" class="score-display">
                  <div class="text-h5 font-weight-bold text-primary">
                    {{ bet.score }}
                  </div>
                  <div class="text-caption text-grey-darken-1">Final</div>
                </div>
                <div v-else class="vs-display">
                  <div class="text-h6 font-weight-bold text-grey-darken-1">VS</div>
                </div>
              </div>

              <!-- Équipe extérieure -->
              <div class="team-section">
                <v-avatar size="50" color="grey-lighten-4" class="mb-2">
                  <v-img :src="bet.awayTeam.crest" :alt="bet.awayTeam.name"></v-img>
                </v-avatar>
                <div class="text-body-2 font-weight-bold text-center team-name">
                  {{ bet.awayTeam.tla }}
                </div>
                <div class="text-caption text-grey-darken-1 text-center">
                  {{ bet.awayTeam.name }}
                </div>
              </div>
            </div>

            <!-- Gagnant si terminé -->
            <div v-if="bet.isEnded && bet.winner" class="winner-section mb-3">
              <v-chip
                color="warning"
                size="small"
                variant="tonal"
                class="w-100"
              >
                <TrophyIcon :size="16" class="mr-2" />
                Vainqueur: {{ bet.winner }}
              </v-chip>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Statistiques -->
            <div class="stats-section mb-3">
              <v-row dense>
                <v-col cols="6">
                  <div class="stat-box">
                    <UsersIcon :size="20" class="text-primary mb-1" />
                    <div class="text-h6 font-weight-bold">{{ (bet as any).totalBets || 0 }}</div>
                    <div class="text-caption text-grey-darken-1">Parieurs</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="stat-box">
                    <v-icon color="warning" class="mb-1">mdi-chart-line</v-icon>
                    <div class="text-h6 font-weight-bold">
                      {{ bet.isActive ? 'Ouvert' : 'Fermé' }}
                    </div>
                    <div class="text-caption text-grey-darken-1">Statut paris</div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Pourcentages -->
            <v-sheet color="grey-lighten-4" rounded="lg" class="pa-3 mb-3">
              <div class="d-flex justify-space-between align-center">
                <div class="text-center flex-grow-1">
                  <div class="text-caption text-grey-darken-1">Gain</div>
                  <div class="text-h6 font-weight-bold text-success">+{{ bet.winPercentage }}%</div>
                </div>
                <v-divider vertical class="mx-2"></v-divider>
                <div class="text-center flex-grow-1">
                  <div class="text-caption text-grey-darken-1">Perte</div>
                  <div class="text-h6 font-weight-bold text-error">-{{ bet.lossPercentage }}%</div>
                </div>
              </div>
            </v-sheet>

            <!-- Dates -->
            <div class="dates-section">
              <div class="d-flex align-center mb-2">
                <v-icon size="16" color="grey-darken-1" class="mr-2">
                  mdi-calendar-start
                </v-icon>
                <span class="text-caption text-grey-darken-1">
                  Début: {{ formatDate(bet.start_at, 'DD/MM/YYYY HH:mm') }}
                </span>
              </div>
              <div class="d-flex align-center">
                <ClockIcon :size="16" class="text-grey-darken-1 mr-2" />
                <span class="text-caption text-grey-darken-1">
                  <span v-if="!bet.isEnded">
                    Fin: {{ formatDate(bet.end_at, 'DD/MM/YYYY HH:mm') }}
                    <v-chip size="x-small" color="primary" variant="tonal" class="ml-2">
                      {{ getTimeRemaining(bet.end_at) }}
                    </v-chip>
                  </span>
                  <span v-else>
                    Terminé le {{ formatDate(bet.end_at, 'DD/MM/YYYY HH:mm') }}
                  </span>
                </span>
              </div>
            </div>
          </v-card-text>

          <!-- Actions rapides -->
          <v-card-actions class="pa-3 pt-0">
            <v-btn
              v-if="!bet.isEnded"
              size="small"
              variant="outlined"
              color="primary"
              @click="handleEdit(bet, $event)"
              prepend-icon="mdi-pencil"
            >
              Modifier
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!bet.isEnded"
              size="small"
              :color="bet.isActive ? 'warning' : 'success'"
              variant="flat"
              @click="handleToggleStatus(bet, $event)"
            >
              {{ bet.isActive ? 'Désactiver' : 'Activer' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message si aucun pari -->
    <v-alert
      v-if="bets.length == 0"
      type="info"
      variant="tonal"
      class="text-center"
    >
      Aucun pari créé pour le moment
    </v-alert>
  </div>
</template>

<style scoped>
.admin-bet-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.admin-bet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.teams-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.team-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.team-name {
  line-height: 1.2;
  min-height: 1.2em;
}

.vs-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex-shrink: 0;
}

.score-display {
  text-align: center;
}

.vs-display {
  text-align: center;
}

.winner-section {
  display: flex;
  justify-content: center;
}

.stats-section {
  background: rgba(0, 0, 0, 0.02);
  padding: 8px;
  border-radius: 8px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 8px;
}

.dates-section {
  background: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
}

.w-100 {
  width: 100%;
}
</style>