<script setup lang="ts">
// Interface pour typer les utilisateurs
interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  status: "Actif" | "Inactif" | "Suspendu" | "En attente";
  role: "Utilisateur" | "VIP" | "Premium" | "Admin";
  balance: number;
  totalInvested: number;
  profitLoss: number;
  lastLogin: string;
  createdAt: string;
  avatarColor: string;
}

// Données fictives
const users = ref<User[]>([
  {
    id: 1,
    name: "Murel",
    surname: "Relou",
    email: "murel.relou@example.com",
    phone: "+237 677 123 456",
    status: "Actif",
    role: "Admin",
    balance: 39358.0,
    totalInvested: 25000.0,
    profitLoss: 5689.5,
    lastLogin: "2024-08-04T10:30:00",
    createdAt: "2024-01-15T09:00:00",
    avatarColor: "primary",
  },
  {
    id: 2,
    name: "Jean",
    surname: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+237 677 234 567",
    status: "Actif",
    role: "VIP",
    balance: 15750.0,
    totalInvested: 12000.0,
    profitLoss: 2340.75,
    lastLogin: "2024-08-04T08:15:00",
    createdAt: "2024-02-20T14:30:00",
    avatarColor: "success",
  },
  {
    id: 3,
    name: "Marie",
    surname: "Martin",
    email: "marie.martin@example.com",
    phone: "+237 677 345 678",
    status: "Suspendu",
    role: "Utilisateur",
    balance: 2500.0,
    totalInvested: 3000.0,
    profitLoss: -450.25,
    lastLogin: "2024-08-01T16:45:00",
    createdAt: "2024-03-10T11:20:00",
    avatarColor: "error",
  },
  {
    id: 4,
    name: "Paul",
    surname: "Leblanc",
    email: "paul.leblanc@example.com",
    phone: "+237 677 456 789",
    status: "En attente",
    role: "Utilisateur",
    balance: 0.0,
    totalInvested: 0.0,
    profitLoss: 0.0,
    lastLogin: "2024-08-04T07:30:00",
    createdAt: "2024-08-03T16:00:00",
    avatarColor: "warning",
  },
  {
    id: 5,
    name: "Sophie",
    surname: "Bernard",
    email: "sophie.bernard@example.com",
    phone: "+237 677 567 890",
    status: "Actif",
    role: "Premium",
    balance: 28900.0,
    totalInvested: 20000.0,
    profitLoss: 4200.8,
    lastLogin: "2024-08-04T09:20:00",
    createdAt: "2024-01-28T10:15:00",
    avatarColor: "purple",
  },
]);

// État des filtres
const search = ref("");
const statusFilter = ref("");
const roleFilter = ref("");
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

  // Filtre par rôle
  if (roleFilter.value) {
    filtered = filtered.filter((user) => user.role === roleFilter.value);
  }

  // Filtre par date
  if (dateFilter.value) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filtered = filtered.filter((user) => {
      const userDate = new Date(user.lastLogin);

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

const roleOptions = [
  { title: "Tous", value: "" },
  { title: "Admin", value: "Admin" },
  { title: "VIP", value: "VIP" },
  { title: "Premium", value: "Premium" },
  { title: "Utilisateur", value: "Utilisateur" },
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
  { title: "Rôle", key: "role", sortable: true },
  { title: "Solde", key: "balance", sortable: true },
  { title: "Total Investi", key: "totalInvested", sortable: true },
  { title: "Profit/Perte", key: "profitLoss", sortable: true },
  { title: "Dernière connexion", key: "lastLogin", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

// Dialog state
const userDialog = ref(false);
const selectedUser = ref<User | null>(null);

// Méthodes utilitaires
const getStatusColor = (status: string) => {
  switch (status) {
    case "Actif":
      return "success";
    case "Inactif":
      return "grey";
    case "Suspendu":
      return "error";
    case "En attente":
      return "warning";
    default:
      return "grey";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "error";
    case "VIP":
      return "purple";
    case "Premium":
      return "primary";
    case "Utilisateur":
      return "grey";
    default:
      return "grey";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

// Actions sur les utilisateurs
const viewUser = (user: User) => {
  selectedUser.value = user;
  userDialog.value = true;
};

const editUser = (user: User) => {
  console.log("Modifier utilisateur:", user);
  // Logique d'édition
};

const suspendUser = (user: User) => {
  console.log("Suspendre utilisateur:", user);
  // Logique de suspension
};

const adjustBalance = (user: User) => {
  console.log("Ajuster solde:", user);
  // Logique d'ajustement du solde
};

const viewTransactions = (user: User) => {
  console.log("Voir transactions:", user);
  // Navigation vers les transactions
};

const sendMessage = (user: User) => {
  console.log("Envoyer message:", user);
  // Logique d'envoi de message
};

const deleteUser = (user: User) => {
  console.log("Supprimer utilisateur:", user);
  // Logique de suppression avec confirmation
};
</script>

<template>
  <v-container fluid class="pa-0">
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
              <h3 class="text-h5 font-weight-bold">1,247</h3>
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
              <h3 class="text-h5 font-weight-bold">1,089</h3>
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
              <p class="text-caption text-grey-darken-1 mb-1">En Attente</p>
              <h3 class="text-h5 font-weight-bold">87</h3>
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
            <v-avatar color="error" class="me-3">
              <v-icon color="white">mdi-account-off</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-grey-darken-1 mb-1">Suspendus</p>
              <h3 class="text-h5 font-weight-bold">71</h3>
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
              v-model="roleFilter"
              :items="roleOptions"
              label="Rôle"
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
            <v-avatar :color="item.avatarColor" class="me-3" size="40">
              <span class="text-white font-weight-bold">
                {{ item.name.charAt(0) }}{{ item.surname.charAt(0) }}
              </span>
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ item.name }} {{ item.surname }}
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
          <div class="font-weight-bold">
            {{ formatCurrency(item.balance) }}
          </div>
        </template>

        <!-- Total Invested -->
        <template v-slot:item.totalInvested="{ item }">
          <div class="font-weight-medium text-success">
            {{ formatCurrency(item.totalInvested) }}
          </div>
        </template>

        <!-- Profit/Loss -->
        <template v-slot:item.profitLoss="{ item }">
          <div
            :class="item.profitLoss >= 0 ? 'text-success' : 'text-error'"
            class="font-weight-medium"
          >
            {{ item.profitLoss >= 0 ? "+" : ""
            }}{{ formatCurrency(item.profitLoss) }}
          </div>
        </template>

        <!-- Role -->
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            variant="outlined"
            size="small"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <!-- Last Login -->
        <template v-slot:item.lastLogin="{ item }">
          <div class="text-caption">
            {{ formatDate(item.lastLogin) }}
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
              {{ selectedUser.name.charAt(0)
              }}{{ selectedUser.surname.charAt(0) }}
            </span>
          </v-avatar>
          {{ selectedUser.name }} {{ selectedUser.surname }}
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
                    formatDate(selectedUser.createdAt)
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Solde actuel</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatCurrency(selectedUser.balance) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Total investi</v-list-item-title>
                  <v-list-item-subtitle class="text-success">
                    {{ formatCurrency(selectedUser.totalInvested) }}
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
                  >
                    {{ selectedUser.profitLoss >= 0 ? "+" : ""
                    }}{{ formatCurrency(selectedUser.profitLoss) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Dernière connexion</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatDate(selectedUser.lastLogin)
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
