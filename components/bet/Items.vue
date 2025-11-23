<script setup lang="ts">
import type { BetModel } from "~/types/api-bet.type";
import { ClockIcon, TrophyIcon, ChartLineIcon } from "vue-tabler-icons";
import { formatDate } from "~/helpers";

type StateType = {
  bets: BetModel[];
};

const props = defineProps<StateType>();

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
    return { text: "Terminé", color: "grey", icon: "mdi-flag-checkered" };
  }
  if (!bet.isActive) {
    return { text: "Inactif", color: "warning", icon: "mdi-pause-circle" };
  }
  const now = new Date();
  const endDate = new Date(bet.end_at);
  if (now > endDate) {
    return { text: "Expiré", color: "error", icon: "mdi-clock-alert" };
  }
  return { text: "Actif", color: "success", icon: "mdi-check-circle" };
};

const getBeginningStatus = (bet: BetModel) => {
  const now = new Date();
  const startDate = new Date(bet.start_at);
  if (now < startDate) {
    return { text: "Pas debuté", color: "warning", icon: "mdi-close-circle" };
  }
  return null;
};

// Obtenir le score formaté
const getScoreDisplay = (score: string) => {
  if (!score || score === "-") return null;
  return score;
};

// Calculer le temps restant
const getTimeRemaining = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Expiré";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "Moins d'1h";
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
  <div>
    <!-- Liste des paris -->
    <div>
      <v-row>
        <v-col v-for="bet in bets" :key="bet.id" cols="12" sm="6" md="6" lg="4">
          <v-card
            class="admin-bet-card border-sm"
            elevation="0"
            rounded="lg"
            @click="handleBetClick(bet)"
          >
            <!-- En-tête avec statut et actions -->
            <div
              class="card-header pa-3 d-flex justify-space-between align-center"
            >
              <div class="d-flex ga-2">
                <v-chip
                  :color="getBetStatus(bet).color"
                  size="small"
                  variant="flat"
                  :prepend-icon="getBetStatus(bet).icon"
                >
                  {{ getBetStatus(bet).text }}
                </v-chip>

                <v-chip
                  v-if="getBeginningStatus(bet)"
                  :color="getBeginningStatus(bet)?.color"
                  size="small"
                  variant="flat"
                  :prepend-icon="getBeginningStatus(bet)?.icon"
                >
                  {{ getBeginningStatus(bet)?.text }}
                </v-chip>
              </div>

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
                  <v-list-item
                    @click="handleEdit(bet, $event)"
                    prepend-icon="mdi-pencil"
                  >
                    <v-list-item-title>Modifier</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="!bet.isEnded"
                    @click="handleToggleStatus(bet, $event)"
                    :prepend-icon="bet.isActive ? 'mdi-pause' : 'mdi-play'"
                  >
                    <v-list-item-title>
                      {{ bet.isActive ? "Désactiver" : "Activer" }}
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
                    <v-img
                      :src="bet.homeTeam.crest"
                      :alt="bet.homeTeam.name"
                    ></v-img>
                  </v-avatar>
                  <div
                    class="text-body-2 font-weight-bold text-center team-name"
                  >
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
                    <div class="text-h6 font-weight-bold text-grey-darken-1">
                      VS
                    </div>
                  </div>
                </div>

                <!-- Équipe extérieure -->
                <div class="team-section">
                  <v-avatar size="50" color="grey-lighten-4" class="mb-2">
                    <v-img
                      :src="bet.awayTeam.crest"
                      :alt="bet.awayTeam.name"
                    ></v-img>
                  </v-avatar>
                  <div
                    class="text-body-2 font-weight-bold text-center team-name"
                  >
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

              <v-divider class="my-4"></v-divider>

              <!-- Pourcentages -->
              <v-sheet color="grey-lighten-4" rounded="lg" class="pa-3 mb-3">
                <div class="d-flex justify-space-between align-center">
                  <div class="text-center flex-grow-1">
                    <div class="text-caption text-grey-darken-1">Gain</div>
                    <div class="text-h6 font-weight-bold text-success">
                      +{{ bet.winPercentage }}%
                    </div>
                  </div>
                  <v-divider vertical class="mx-2"></v-divider>
                  <div class="text-center flex-grow-1">
                    <div class="text-caption text-grey-darken-1">Perte</div>
                    <div class="text-h6 font-weight-bold text-error">
                      -{{ bet.lossPercentage }}%
                    </div>
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
                    Début: {{ formatDate(bet.start_at, "DD/MM/YYYY HH:mm") }}
                  </span>
                </div>
                <div class="d-flex align-center">
                  <ClockIcon :size="16" class="text-grey-darken-1 mr-2" />
                  <span class="text-caption text-grey-darken-1">
                    <span v-if="!bet.isEnded">
                      Fin: {{ formatDate(bet.end_at, "DD/MM/YYYY HH:mm") }}
                      <v-chip
                        size="x-small"
                        color="primary"
                        variant="tonal"
                        class="ml-2"
                      >
                        {{ getTimeRemaining(bet.end_at) }}
                      </v-chip>
                    </span>
                    <span v-else>
                      Terminé le
                      {{ formatDate(bet.end_at, "DD/MM/YYYY HH:mm") }}
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
                {{ bet.isActive ? "Désactiver" : "Activer" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Message si aucun pari -->
      <v-card
        v-if="bets.length == 0"
        class="empty-state mt-5"
        elevation="0"
        rounded="xl"
      >
        <div class="empty-content">
          <div class="empty-icon-wrapper mb-6">
            <ChartLineIcon size="150" class="text-primary" />
          </div>
          <h3 class="text-h4 font-weight-bold mb-3">Aucun pari disponible</h3>
          <p class="text-h6 text-medium-emphasis mb-6" style="max-width: 500px">
            Veuillez d'abord creer des paris
          </p>
          <v-btn
            color="primary"
            elevation="0"
            prepend-icon="mdi-plus"
            @click="$router.push('/bets/new')"
          >
            Nouveau Pari
          </v-btn>
        </div>
      </v-card>
    </div>
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
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%
  );
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

.empty-state {
  padding: 6rem 2rem;
  border-radius: 24px;
}

.empty-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-wrapper {
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.empty-icon {
  animation: float 3s ease-in-out infinite;
}
</style>
