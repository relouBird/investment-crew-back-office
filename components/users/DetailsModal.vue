<script setup lang="ts">
import { formatCurrency, formatDate } from "~/helpers";
import type { UserDetails } from "~/types/user.type";
import userHelper from "~/helpers/user-helper";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  WalletIcon,
  TrendingUpIcon,
} from "vue-tabler-icons";
import BuildButton from "../ui/BuildButton.vue";

interface Props {
  modelValue: boolean;
  user: UserDetails | null;
}

const props = defineProps<Props>();

const { getStatusColor } = userHelper;

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [userData: Partial<UserDetails>];
}>();

// État d'édition et données locales
const isEditing = ref(false);
const isLoading = ref(false);
const localUser = ref<Partial<UserDetails>>({});

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// Statuts disponibles
const statusOptions = ["Actif", "Inactif", "Suspendu", "En attente"];

// Watcher pour initialiser les données locales quand le dialog s'ouvre
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        status: newUser.status,
        balance: newUser.balance,
        totalInvested: newUser.totalInvested,
        profitLoss: newUser.profitLoss,
        created_at: newUser.created_at,
        last_sign_in_at: newUser.last_sign_in_at,
        avatarColor: newUser.avatarColor,
      };
    }
  },
  { immediate: true },
);

// Activer le mode édition
const enableEdit = () => {
  isEditing.value = true;
};

// Annuler l'édition - restaurer les données originales
const cancelEdit = () => {
  if (props.user) {
    localUser.value = {
      id: props.user.id,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      phone: props.user.phone,
      status: props.user.status,
      balance: props.user.balance,
      totalInvested: props.user.totalInvested,
      profitLoss: props.user.profitLoss,
      created_at: props.user.created_at,
      last_sign_in_at: props.user.last_sign_in_at,
      avatarColor: props.user.avatarColor,
    };
  }
  isEditing.value = false;
};

// Sauvegarder les modifications
const saveUser = async () => {
  // Émettre les données modifiées
  emit("save", localUser.value);
  isLoading.value = true;
  //   isEditing.value = false;
};

// Réinitialiser lors de la fermeture
const handleClose = () => {
  isEditing.value = false;
  dialogValue.value = false;
};
</script>

<template>
  <v-dialog
    v-model="dialogValue"
    max-width="750px"
    max-height="600px"
    scrollable
    persistent
  >
    <v-card v-if="localUser.id" rounded="lg" elevation="0">
      <!-- En-tête avec gradient -->
      <div class="user-header pa-3">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar
              :color="localUser.avatarColor"
              size="43"
              class="user-avatar"
            >
              <span class="text-white font-weight-bold">
                {{ localUser.firstName?.charAt(0)
                }}{{ String(localUser.lastName).charAt(0) }}
              </span>
            </v-avatar>
            <div class="ml-4">
              <div class="d-flex align-center ga-2">
                <h2 class="text-h6 font-weight-bold text-white">
                  {{ localUser.firstName }} {{ localUser.lastName }}
                </h2>
                <v-chip
                  :color="getStatusColor(localUser.status || 'active')"
                  variant="flat"
                  size="x-small"
                  class=""
                >
                  <v-icon start size="14">mdi-circle</v-icon>
                  <span class="">{{ localUser.status }}</span>
                </v-chip>
              </div>
              <div class="text-caption text-white opacity-90">
                <span>
                  <CalendarIcon
                    :size="14"
                    class="mr-1 mb-1"
                    style="display: inline-block; vertical-align: middle"
                  />
                </span>
                <span
                  >Inscrit le
                  {{
                    formatDate(localUser.created_at || "", "DD MMMM YYYY")
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-card-text class="pa-6">
        <!-- Statistiques financières -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card variant="tonal" color="primary" rounded="lg">
              <v-card-text class="px-3 py-2">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center ga-2 pt-1">
                    <p>
                      <WalletIcon :size="25" />
                    </p>
                    <p class="text-caption text-grey-darken-1 text-center pb-1">
                      Solde actuel
                    </p>
                  </div>

                  <v-text-field
                    v-if="isEditing"
                    v-model.number="localUser.balance"
                    type="number"
                    variant="outlined"
                    density="compact"
                    prefix="&#x244;"
                    max-width="150px"
                    hide-details
                  ></v-text-field>
                  <div
                    v-else
                    class="text-body-1 font-weight-bold text-center"
                    v-html="formatCurrency(localUser.balance || 0)"
                  ></div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- <v-col cols="12" md="4">
            <v-card variant="tonal" color="primary" rounded="lg">
              <v-card-text class="pa-1">
                <div class="d-flex align-center justify-center">
                  <WalletIcon :size="32" />
                </div>
                <div class="text-caption text-grey-darken-1 text-center">
                  Solde actuel
                </div>
                <v-text-field
                  v-if="isEditing"
                  v-model.number="localUser.balance"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="&#x244;"
                  hide-details
                ></v-text-field>
                <div
                  v-else
                  class="text-h5 font-weight-bold text-center"
                  v-html="formatCurrency(localUser.balance || 0)"
                ></div>
              </v-card-text>
            </v-card>
          </v-col> -->
          <!-- <v-col cols="12" md="4">
            <v-card variant="tonal" color="success" rounded="lg">
              <v-card-text class="pa-1">
                <div class="d-flex align-center justify-center">
                  <v-icon size="32">mdi-cash-plus</v-icon>
                </div>
                <div class="text-caption text-grey-darken-1 text-center">
                  Total investi
                </div>
                <v-text-field
                  v-if="isEditing"
                  v-model.number="localUser.totalInvested"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="&#x244;"
                  hide-details
                ></v-text-field>
                <div
                  v-else
                  class="text-h5 font-weight-bold text-success text-center"
                  v-html="formatCurrency(localUser.totalInvested || 0)"
                ></div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              variant="tonal"
              :color="(localUser.profitLoss || 0) >= 0 ? 'success' : 'error'"
              rounded="lg"
            >
              <v-card-text class="pa-1">
                <div class="d-flex align-center justify-center">
                  <TrendingUpIcon :size="32" />
                </div>
                <div class="text-caption text-grey-darken-1 text-center">
                  Profit/Perte
                </div>
                <v-text-field
                  v-if="isEditing"
                  v-model.number="localUser.profitLoss"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="&#x244;"
                  hide-details
                ></v-text-field>
                <div
                  v-else
                  class="text-h5 font-weight-bold text-center"
                  :class="
                    (localUser.profitLoss || 0) >= 0
                      ? 'text-success'
                      : 'text-error'
                  "
                  v-html="
                    `${
                      (localUser.profitLoss || 0) >= 0 ? '+' : ''
                    } ${formatCurrency(localUser.profitLoss || 0)}`
                  "
                ></div>
              </v-card-text>
            </v-card>
          </v-col> -->
        </v-row>

        <v-divider class="my-2"></v-divider>

        <!-- Informations personnelles -->
        <div class="mb-0">
          <h3 class="text-h6 font-weight-bold mb-4">
            Informations personnelles
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <!-- Prénom -->
              <BuildButton
                v-model="localUser.firstName"
                color="primary"
                label="Prénom"
                variant="outlined"
                density="compact"
                class="mb-3"
                :readonly="!isEditing"
                :bg-color="!isEditing"
                :icon="UserIcon"
              />

              <!-- Nom -->
              <BuildButton
                v-model="localUser.lastName"
                color="primary"
                label="Nom"
                variant="outlined"
                density="compact"
                class="mb-3"
                :readonly="!isEditing"
                :bg-color="!isEditing"
                :icon="UserIcon"
              />

              <!-- Email -->
              <BuildButton
                v-model="localUser.email"
                color="primary"
                label="Email"
                type="email"
                variant="outlined"
                density="compact"
                class="mb-3"
                :readonly="!isEditing"
                :bg-color="!isEditing"
                :icon="MailIcon"
              />

              <!-- Téléphone -->
              <BuildButton
                v-model="localUser.phone"
                color="primary"
                label="Téléphone"
                type="number"
                variant="outlined"
                density="compact"
                placeholder="6 XXX XXX XXX"
                class=""
                :readonly="!isEditing"
                :bg-color="!isEditing"
                :icon="PhoneIcon"
              />
            </v-col>

            <v-col cols="12" md="6">
              <!-- Statut -->
              <v-select
                v-model="localUser.status"
                color="primary"
                :items="statusOptions"
                label="Statut du compte"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-shield-check"
                class="mb-3"
                :readonly="!isEditing"
                :bg-color="!isEditing ? 'grey-lighten-4' : 'white'"
              ></v-select>

              <!-- Date d'inscription (non modifiable) -->
              <v-text-field
                :model-value="
                  formatDate(localUser.created_at || '', 'DD MMMM YYYY')
                "
                color="primary"
                label="Date d'inscription"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar"
                readonly
                bg-color="grey-lighten-4"
                class="mb-3"
              ></v-text-field>

              <!-- Dernière connexion (non modifiable) -->
              <v-text-field
                :model-value="
                  formatDate(
                    localUser.last_sign_in_at || '',
                    'DD/MM/YYYY HH:mm',
                  )
                "
                color="primary"
                label="Dernière connexion"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-clock-outline"
                readonly
                bg-color="grey-lighten-4"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-2">
        <v-spacer />
        <div v-if="!isEditing">
          <v-btn variant="text" @click="handleClose"> Fermer </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-pencil"
            class="ml-2"
            size="small"
            @click="enableEdit"
          >
            Modifier
          </v-btn>
        </div>

        <template v-else>
          <v-btn variant="text" @click="cancelEdit" size="large">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveUser"
            prepend-icon="mdi-content-save"
            size="large"
          >
            Enregistrer
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.user-header {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary-darken-1)) 100%
  );
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.opacity-90 {
  opacity: 0.9;
}

/* Style pour les champs en lecture seule */
:deep(.v-field--readonly) {
  cursor: default;
}
</style>
