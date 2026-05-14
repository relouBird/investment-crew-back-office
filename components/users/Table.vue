<script lang="ts" setup>
import type { UserDetails } from "~/types/user.type";
import userHelper from "~/helpers/user-helper";
import { formatCurrency, formatDate } from "~/helpers";
// Props
interface Props {
  users: UserDetails[];
}

const props = defineProps<Props>();

const { getRandomColor, getStatusColor } = userHelper;

// Emits
const emit = defineEmits<{
  confirm: [{ user: UserDetails; openDialog: boolean }];
}>();

// Headers du tableau
const headers = [
  { title: "Utilisateur", key: "name", sortable: true },
  { title: "Statut", key: "status", sortable: true },
  { title: "Solde", key: "balance", sortable: true },
  { title: "Total Investi", key: "totalInvested", sortable: true },
  { title: "Profit/Perte", key: "profitLoss", sortable: true },
  { title: "Dernière connexion", key: "last_sign_in_at", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

// Actions sur les utilisateurs
const viewUser = (user: UserDetails) => {
  emit("confirm", { user, openDialog: true });
};

const editUser = (user: UserDetails) => {
  console.log("Modifier utilisateur:", user);
  // Logique d'édition
};

const suspendUser = (user: UserDetails) => {
  console.log("Suspendre utilisateur:", user);
  // Logique de suspension
};

const adjustBalance = (user: UserDetails) => {
  console.log("Ajuster solde:", user);
  // Logique d'ajustement du solde
};

const viewTransactions = (user: UserDetails) => {
  console.log("Voir transactions:", user);
  navigateTo(`/users/${user.id}/transactions`);
  // Navigation vers les transactions
};

const viewBets = (user: UserDetails) => {
  console.log("Envoyer message:", user);
  navigateTo(`/users/${user.id}/bets`);
  // Logique d'envoi de message
};

const deleteUser = (user: UserDetails) => {
  console.log("Supprimer utilisateur:", user);
  // Logique de suppression avec confirmation
};
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :items-per-page="10"
    class="elevation-0"
  >
    <!-- Avatar and Name -->
    <template v-slot:item.name="{ item }">
      <div class="d-flex align-center py-2">
        <v-avatar :color="getRandomColor()" class="me-3" size="40">
          <span class="text-white font-weight-bold">
            {{
              (item.firstName + " " + item.lastName)
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")
                .toUpperCase()
            }}
          </span>
        </v-avatar>
        <div>
          <div class="font-weight-medium">
            {{ item.firstName }} {{ item.lastName }}
          </div>
          <div class="text-caption text-grey-darken-1">
            {{ item.email }}
          </div>
        </div>
      </div>
    </template>

    <!-- Status -->
    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
        {{ item.status }}
      </v-chip>
    </template>

    <!-- Balance -->
    <template v-slot:item.balance="{ item }">
      <div class="font-weight-bold text-no-wrap" v-html="formatCurrency(item.balance)"></div>
    </template>

    <!-- Total Invested -->
    <template v-slot:item.totalInvested="{ item }">
      <div
        class="font-weight-medium text-success text-no-wrap"
        v-html="formatCurrency(item.totalInvested)"
      ></div>
    </template>

    <!-- Profit/Loss -->
    <template v-slot:item.profitLoss="{ item }">
      <div
        :class="item.profitLoss >= 0 ? 'text-success' : 'text-error'"
        class="font-weight-medium"
        v-html="
          `${item.profitLoss >= 0 ? '+' : ''} ${formatCurrency(
            item.profitLoss
          )}`
        "
      ></div>
    </template>

    <!-- Last Login -->
    <template v-slot:item.last_sign_in_at="{ item }">
      <div class="text-caption">
        {{ formatDate(item.last_sign_in_at) }}
      </div>
    </template>

    <!-- Actions -->
    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-1">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          color="primary"
          @click="viewUser(item)"
        />

        <!-- Bouton Bloquer/Débloquer -->
        <v-btn
          :icon="
            item.status === 'Suspendu'
              ? 'mdi-account-check'
              : 'mdi-account-lock'
          "
          size="small"
          variant="text"
          :color="item.status === 'Suspendu' ? 'success' : 'error'"
          @click="suspendUser(item)"
        />

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
              v-bind="props"
            />
          </template>
          <v-list density="compact">
            <v-list-item @click="adjustBalance(item)">
              <v-list-item-title>Ajuster le solde</v-list-item-title>
            </v-list-item>
            <v-list-item @click="viewTransactions(item)">
              <v-list-item-title>Voir transactions</v-list-item-title>
            </v-list-item>
            <v-list-item @click="viewBets(item)">
              <v-list-item-title>Voir Paris</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="deleteUser(item)" class="text-error">
              <v-list-item-title>Supprimer</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped>
.v-data-table {
  background: transparent;
}

.v-card {
  border-radius: 12px;
}

.v-chip {
  font-weight: 500;
}
</style>
