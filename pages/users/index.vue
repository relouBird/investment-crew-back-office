<script setup lang="ts">
import useUserStore from "~/stores/users.store";
import { LoaderAreas } from "~/constants";
import type { UserDetails, UserMetaData } from "~/types/user.type";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// Meta tags
useSeoHead({
  title: "Gestion des Utilisateurs",
  subtitle: "Gérez tous les utilisateurs de la plateforme d'investissement",
  forcePrefix: true,
});

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
        user.email.toLowerCase().includes(searchTerm),
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
            today.getDate(),
          );
          return userDate >= monthAgo;
        case "year":
          const yearAgo = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate(),
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

// Dialog state
const userDialog = ref(false);
const selectedUser = ref<UserDetails | null>(null);

// Actions sur les utilisateurs
const viewUser = ({
  user,
  openDialog,
}: {
  user: UserDetails;
  openDialog: boolean;
}) => {
  selectedUser.value = user;
  userDialog.value = openDialog;
};

const saveUser = async (user: Partial<UserDetails>) => {
  try {
    const response = await userStore.updateUserDetails(
      user,
      selectedUser.value?.user_metadata as UserMetaData,
    );
  } catch (e) {
  } finally {
  }
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
      <div class="mb-6">
        <v-row class="d-flex align-center justify-space-between flex-wrap">
          <!-- Titre -->
          <v-col cols="12" md="6" class="">
            <h1 class="text-h4 font-weight-bold text-primary">
              Gestion des Utilisateurs
            </h1>
            <p class="text-subtitle-1 text-grey-darken-1">
              Gérez tous les utilisateurs de la plateforme d'investissement
            </p>
          </v-col>
          <!-- Boutons -->
          <v-col cols="12" md="6" class="d-flex justify-end flex-wrap">
            <v-btn color="primary" prepend-icon="mdi-plus">
              Nouvel Utilisateur
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Stats Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="6" lg="3">
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
        <v-col cols="12" sm="6" md="6" lg="3">
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
        <v-col cols="12" sm="6" md="6" lg="3">
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
        <v-col cols="12" sm="6" md="6" lg="3">
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
        <users-table :users="filteredUsers" v-on:confirm="viewUser" />
      </v-card>

      <!-- User Detail Dialog -->
      <users-details-modal
        v-model:model-value="userDialog"
        :user="selectedUser"
        v-on:save="saveUser"
      />
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
