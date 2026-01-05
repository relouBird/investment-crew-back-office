<script setup lang="ts">
import { AlertCircleIcon,SoccerFieldIcon } from "vue-tabler-icons";
import { formatCurrency } from "~/helpers";
import useUserBetStore from "~/stores/bet-users.store";
import useBetStore from "~/stores/bet.store";
import type { betRecapType } from "~/types";
import type { UserBetModel } from "~/types/api-bet.type";


//store
const betStore = useBetStore();
const userBetStore = useUserBetStore();

// données réactives
const betsActive = computed(() => {
  return betStore.getBets.filter((bet) => {
    const now = new Date();
    const endDate = new Date(bet.end_at);

    // Si le pari est encore actif
    const isActive = now < endDate && !bet.isEnded;

    // Vérifier si le pari a eu des activités dans les 30 derniers jours
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const is30DaysPast = new Date(bet.created_at ?? "") >= last30Days;

    return isActive && is30DaysPast;
  });
});

const usersBetsOnActiveBets = computed(() => {
  let data: UserBetModel[] = [];
  userBetStore.getUsersBets.forEach((bet) => {
    const matchedBet = betsActive.value.find((b) => b.id === bet.matchId);
    if (matchedBet) {
      data.push(bet);
    }
  });
  return data;
});

const stats = computed(() => {
  const recap: betRecapType[] = [];

  // Pour chaque pari actif, on calcule les stats
  betsActive.value.forEach((bet) => {
    let id = bet.id;
    let homeTeam = bet.homeTeam.tla;
    let awayTeam = bet.awayTeam.tla;
    let totalBets = 0;
    let totalAmount = 0;
    let status = bet.isEnded ? "ended" : "active";

    const usersBetsForThisBet = usersBetsOnActiveBets.value.filter(
      (userBet) => userBet.matchId === bet.id
    );

    usersBetsForThisBet.forEach((userBet) => {
      totalBets += 1;
      totalAmount +=
        userBet.prediction == bet.winner
          ? totalAmount - userBet.potentialGain
          : totalAmount + userBet.potentialLoss;
    });

    recap.push({
      id: id ? id : 1,
      homeTeam,
      awayTeam,
      totalBets,
      totalAmount,
      status,
    });
  });

  return recap;
});

const topMatches = ref<betRecapType[]>([
  {
    id: 1,
    homeTeam: "PSG",
    awayTeam: "Real Madrid",
    totalBets: 456,
    totalAmount: 45600,
    status: "active",
  },
  {
    id: 2,
    homeTeam: "Barcelona",
    awayTeam: "Bayern Munich",
    totalBets: 389,
    totalAmount: 38900,
    status: "active",
  },
  {
    id: 3,
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    totalBets: 512,
    totalAmount: 51200,
    status: "ended",
  },
]);
</script>

<template>
  <v-card elevation="0" class="border border-opacity" rounded="lg">
    <v-card-title class="pa-4">
      <div>
        <h3 class="text-h6 font-weight-bold">Top Matchs</h3>
        <p class="text-caption text-grey-darken-1 mb-0">
          Matchs les plus actifs sur les 30 derniers jours
        </p>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4" v-if="stats.length">
      <div
        v-for="match in stats"
        :key="match.id"
        class="match-item pa-3 rounded-lg mb-3"
      >
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="font-weight-bold">
            {{ match.homeTeam }} vs {{ match.awayTeam }}
          </div>
          <v-chip
            size="x-small"
            :color="match.status === 'active' ? 'success' : 'grey'"
            variant="flat"
          >
            {{ match.status === "active" ? "Actif" : "Terminé" }}
          </v-chip>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="text-caption text-grey-darken-1">
            <v-icon size="14" class="mr-1">mdi-account-group</v-icon>
            {{ match.totalBets }} paris
          </div>
          <div
            class="text-body-2 font-weight-bold text-primary"
            v-html="formatCurrency(match.totalAmount)"
          ></div>
        </div>
      </div>
    </v-card-text>
    <v-card-text v-else class="pa-4 d-flex justify-center align-center flex-column">
        <SoccerFieldIcon class="text-grey-darken-1 mt-4" size="210" />
        <h6 class="text-body-1 font-weight-bold text-grey-darken-1 mb-2">Aucun match actif</h6>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.match-item {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.match-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
