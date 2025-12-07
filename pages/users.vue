<script setup lang="ts">
import useUserStore from "~/stores/users.store";
import { LoaderAreas } from "~/constants";
import { formatDate, formatCurrency } from "~/helpers";
import type { UserDetails } from "~/types/user.type";

// Stores
const userStore = useUserStore();

// Données réactives...
const isLoading = ref<boolean>(false);

// Données fictives
const users = computed(() => userStore.getUsers);

// État des filtres
const search = ref("");
const statusFilter = ref("");
const dateFilter = ref("");

// Computed pour filtrer les utilisateurs
const filteredUsers = computed(() => {
  let filtered = users.value;

  // Filtre par recherche (nom, prénom, email)
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.surname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter((user) => user.status === statusFilter.value);
  }

  // Filtre par date
  if (dateFilter.value) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filtered = filtered.filter((user) => {
      const userDate = new Date(user.last_sign_in_at);

      switch (dateFilter.value) {
        case "today":
          return userDate >= today;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return userDate >= weekAgo;
        case "month":
          const monthAgo = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
          );
          return userDate >= monthAgo;
        case "year":
          const yearAgo = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate()
          );
          return userDate >= yearAgo;
        default:
          return true;
      }
    });
  }

  return filtered;
});

// Options des filtres
const statusOptions = [
  { title: "Tous", value: "" },
  { title: "Actif", value: "Actif" },
  { title: "Inactif", value: "Inactif" },
  { title: "Suspendu", value: "Suspendu" },
  { title: "En attente", value: "En attente" },
];

const dateOptions = [
  { title: "Toutes", value: "" },
  { title: "Aujourd'hui", value: "today" },
  { title: "Cette semaine", value: "week" },
  { title: "Ce mois", value: "month" },
  { title: "Cette année", value: "year" },
];

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

// Dialog state
const userDialog = ref(false);
const selectedUser = ref<UserDetails | null>(null);

// Méthodes utilitaires
const getStatusColor = (status: string) => {
  switch (status) {
    case "Actif":
      return "success";
    case "Inactif":
      return "warning";
    case "Suspendu":
      return "error";
    case "En attente":
      return "warning";
    default:
      return "grey";
  }
};

const getRandomColor = () => {
  let tabColor = ["error", "warning", "success", "primary", "info"];

  let index = Math.floor(Math.random() * tabColor.length);

  return tabColor[index];
};

// Actions sur les utilisateurs
const viewUser = (user: UserDetails) => {
  selectedUser.value = user;
  userDialog.value = true;
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
  // Navigation vers les transactions
};

const sendMessage = (user: UserDetails) => {
  console.log("Envoyer message:", user);
  // Logique d'envoi de message
};

const deleteUser = (user: UserDetails) => {
  console.log("Supprimer utilisateur:", user);
  // Logique de suppression avec confirmation
};

const loadUsers = async () => {
  try {
    isLoading.value = true;
    await userStore.fetch();
  } catch (e) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // load les users
  await loadUsers();
});
</script>

<template>
  <ui-loader
    v-model="isLoading"
    :area="LoaderAreas.BODY"
    :text="`Chargement de vos utilisateurs...`"
  >
    <div v-if="isLoading" class="loading-container">
      <v-row class="mt-8">
        <v-col cols="12">
          <v-skeleton-loader type="article" />
        </v-col>
        <v-col cols="12" lg="6" md="6" v-for="value in 2">
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12" lg="4" md="6" v-for="value in 6">
          <v-skeleton-loader
            class="mx-auto border"
            type="image, article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <v-container fluid class="pa-0" v-else>
      <!-- Header Section -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-primary">
            Gestion des Utilisateurs
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Gérez tous les utilisateurs de la plateforme d'investissement
          </p>
        </div>
        <v-btn color="primary" prepend-icon="mdi-plus">
          Nouvel Utilisateur
        </v-btn>
      </div>

      <!-- Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 border-sm border-opacity"
            elevation="0"
            rounded="lg"
          >
            <div class="d-flex align-center">
              <v-avatar color="primary" class="me-3">
                <v-icon color="white">mdi-account-group</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">
                  Total Utilisateurs
                </p>
                <h3 class="text-h5 font-weight-bold">{{ users.length }}</h3>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 border-sm border-opacity"
            elevation="0"
            rounded="lg"
          >
            <div class="d-flex align-center">
              <v-avatar color="success" class="me-3">
                <v-icon color="white">mdi-account-check</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">
                  Utilisateurs Actifs
                </p>
                <h3 class="text-h5 font-weight-bold">
                  {{ users.filter((u) => u.status == "Actif").length }}
                </h3>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 border-sm border-opacity"
            elevation="0"
            rounded="lg"
          >
            <div class="d-flex align-center">
              <v-avatar color="info" class="me-3">
                <v-icon color="white">mdi-account-off</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">Non actif</p>
                <h3 class="text-h5 font-weight-bold">
                  {{ users.filter((u) => u.status == "Inactif").length }}
                </h3>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card
            class="pa-4 border-sm border-opacity"
            elevation="0"
            rounded="lg"
          >
            <div class="d-flex align-center">
              <v-avatar color="warning" class="me-3">
                <v-icon color="white">mdi-account-clock</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-grey-darken-1 mb-1">En attente</p>
                <h3 class="text-h5 font-weight-bold">
                  {{ users.filter((u) => u.status == "Suspendu").length }}
                </h3>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6 border-sm border-opacity" elevation="0" rounded="lg">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Rechercher un utilisateur..."
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Statut"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="dateFilter"
                :items="dateOptions"
                label="Période"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="primary" block> Filtrer </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Users Table -->
      <v-card class="border-sm border-opacity" elevation="0" rounded="lg">
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
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
            <v-chip
              :color="getStatusColor(item.status)"
              variant="tonal"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Balance -->
          <template v-slot:item.balance="{ item }">
            <div
              class="font-weight-bold"
              v-html="formatCurrency(item.balance)"
            ></div>
          </template>

          <!-- Total Invested -->
          <template v-slot:item.totalInvested="{ item }">
            <div
              class="font-weight-medium text-success"
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

              <!-- Bouton Valider compte (si en attente) -->
              <v-btn
                v-if="item.status === 'En attente'"
                icon="mdi-account-plus"
                size="small"
                variant="text"
                color="success"
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
                  <v-list-item @click="sendMessage(item)">
                    <v-list-item-title>Envoyer message</v-list-item-title>
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
      </v-card>

      <!-- User Detail Dialog -->
      <v-dialog v-model="userDialog" max-width="800">
        <v-card v-if="selectedUser">
          <v-card-title class="d-flex align-center font-montserrat">
            <v-avatar :color="selectedUser.avatarColor" class="me-3">
              <span class="text-white font-weight-bold">
                {{ selectedUser.firstName.charAt(0)
                }}{{ String(selectedUser.lastName).charAt(0) }}
              </span>
            </v-avatar>
            {{ selectedUser.firstName }} {{ selectedUser.lastName }}
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedUser.email
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Téléphone</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedUser.phone
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Statut</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        :color="getStatusColor(selectedUser.status)"
                        variant="tonal"
                        size="small"
                      >
                        {{ selectedUser.status }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Date d'inscription</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formatDate(selectedUser.created_at)
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list density="compact">
                  <v-list-item>
                    <v-list-item-title>Solde actuel</v-list-item-title>
                    <v-list-item-subtitle
                      class="font-weight-bold"
                      v-html="formatCurrency(selectedUser.balance)"
                    >
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Total investi</v-list-item-title>
                    <v-list-item-subtitle
                      class="text-success"
                      v-html="formatCurrency(selectedUser.totalInvested)"
                    >
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Profit/Perte</v-list-item-title>
                    <v-list-item-subtitle
                      :class="
                        selectedUser.profitLoss >= 0
                          ? 'text-success'
                          : 'text-error'
                      "
                      v-html="
                        `${
                          selectedUser.profitLoss >= 0 ? '+' : ''
                        } ${formatCurrency(selectedUser.profitLoss)}`
                      "
                    >
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Dernière connexion</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formatDate(selectedUser.last_sign_in_at)
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="userDialog = false">Fermer</v-btn>
            <v-btn color="primary" @click="editUser(selectedUser)"
              >Modifier</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </ui-loader>
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
