<script setup lang="ts">
import { formatCurrency } from "~/helpers";
import {
  UsersIcon,
  TrophyIcon,
  WalletIcon,
  ActivityIcon,
} from "vue-tabler-icons";

import useUserBetStore from "~/stores/bet-users.store";
import useBetStore from "~/stores/bet.store";
import useSponsoringStore from "~/stores/sponsoring.store";
import useTransactionStore from "~/stores/transaction.store";
import useUserStore from "~/stores/users.store";
import useWalletStore from "~/stores/wallet.store";
import {
  TRANSACTION_STATUS_TYPE,
  TRANSACTION_TYPE,
} from "~/types/transaction.type";

//store
const walletStore = useWalletStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const sponsoringStore = useSponsoringStore();
const betStore = useBetStore();
const userBetStore = useUserBetStore();

// Données reactives
const users = computed(() => userStore.getUsers);
const thisMonthUsersLength = computed(
  () =>
    users.value.filter((user) => {
      const createdAt = new Date(user.created_at);
      const now = new Date();
      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length
);
const allUsersLength = computed(() => userStore.getUsers.length);
const activeBets = computed(() => {
  return betStore.getBets.filter((bet) => {
    const now = new Date();
    const endDate = new Date(bet.end_at);
    return now < endDate && !bet.isEnded;
  }).length;
});
const totalBets = computed(() => userBetStore.getUsersBets.length);
const todayBets = computed(() => {
  return (
    userBetStore.getUsersBets.filter((bet) => {
      const createdAt = new Date(bet.created_at ?? "");
      const now = new Date();
      return (
        createdAt.getDate() === now.getDate() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length ?? 0
  );
});

const balance = computed(() => {
  let balance = 0;

  transactionStore.getTransactions?.forEach((transaction) => {
    if (transaction.status == TRANSACTION_STATUS_TYPE.DONE) {
      switch (transaction.type) {
        case TRANSACTION_TYPE.DEPOSIT:
          balance += transaction.amount;
          break;
        case TRANSACTION_TYPE.WITHDRAWAL:
          balance -= transaction.amount;
          break;
        case TRANSACTION_TYPE.GAIN:
          balance -= transaction.amount;
          break;
        case TRANSACTION_TYPE.LOSS:
          balance += transaction.amount;
          break;
      }
    }
  });

  return balance;
});

// Données du dashboard
const stats = ref({
  totalUsers: allUsersLength.value,
  activeMatches: activeBets.value,
  totalBets: totalBets.value,
  totalRevenue: balance.value,
  pendingTransactions: 15,
  monthlyGrowth: (thisMonthUsersLength.value / allUsersLength.value) * 100 || 0,
  todayBets: todayBets.value,
});
</script>
<template>
  <!-- Statistiques principales -->
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="6" lg="3">
      <v-card
        class="stat-card border border-opacity"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-caption text-grey-darken-1 mb-1">
                Utilisateurs
              </div>
              <div class="text-h5 font-weight-bold">
                {{ stats.totalUsers }}
              </div>
            </div>
            <v-avatar color="primary" size="50" class="stat-icon">
              <UsersIcon :size="28" />
            </v-avatar>
          </div>
          <v-chip size="x-small" color="success" variant="flat">
            <v-icon start size="12">mdi-trending-up</v-icon>
            +{{ stats.monthlyGrowth }}% ce mois
          </v-chip>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="6" lg="3">
      <v-card
        class="stat-card border border-opacity"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-caption text-grey-darken-1 mb-1">
                Matchs actifs
              </div>
              <div class="text-h5 font-weight-bold">
                {{ stats.activeMatches }}
              </div>
            </div>
            <v-avatar color="success" size="50" class="stat-icon">
              <TrophyIcon :size="28" />
            </v-avatar>
          </div>
          <v-chip size="x-small" color="info" variant="flat"> En cours </v-chip>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="6" lg="3">
      <v-card
        class="stat-card border border-opacity"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-caption text-grey-darken-1 mb-1">
                Paris totaux
              </div>
              <div class="text-h5 font-weight-bold">
                {{ stats.totalBets }}
              </div>
            </div>
            <v-avatar color="warning" size="50" class="stat-icon">
              <ActivityIcon :size="28" />
            </v-avatar>
          </div>
          <v-chip size="x-small" color="primary" variant="flat">
            Aujourd'hui: {{ stats.todayBets }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="6" lg="3">
      <v-card
        class="stat-card border border-opacity"
        elevation="0"
        rounded="lg"
      >
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-caption text-grey-darken-1 mb-1">Revenus</div>
              <div
                class="text-h5 font-weight-bold"
                v-html="formatCurrency(stats.totalRevenue)"
              ></div>
            </div>
            <v-avatar color="error" size="50" class="stat-icon">
              <WalletIcon :size="28" />
            </v-avatar>
          </div>
          <v-chip size="x-small" color="success" variant="flat">
            Ce mois
          </v-chip>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.stat-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-icon {
  background: linear-gradient(
    135deg,
    var(--v-theme-primary) 0%,
    var(--v-theme-primary-darken-1) 100%
  );
}
</style>
