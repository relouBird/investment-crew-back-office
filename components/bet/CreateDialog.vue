<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import type {
  BetCreationData,
  BetTeamType,
  TeamModel,
} from "~/types/api-bet.type";
import { PercentageIcon } from "vue-tabler-icons";
import type { DatePropsInterface } from "~/types";
import { generateTime } from "~/helpers/bet-helper";
import useBetStore from "~/stores/bet.store";

// Props
interface Props {
  selectedTeams: TeamModel[];
  modelValue: boolean;
}

const props = defineProps<Props>();

// Store
const betStore = useBetStore();

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [betData: BetCreationData];
}>();

// Données réactives
const otpCode = ref<string>("00");
const winner = ref<string>("draw");
// Equipe domicile
const homeTeam = computed<BetTeamType>(() => {
  return {
    name: props.selectedTeams[0].name,
    crest: props.selectedTeams[0].crest,
    tla: props.selectedTeams[0].tla,
  };
});
// Equipe exterieure
const awayTeam = computed<BetTeamType>(() => {
  return {
    name: props.selectedTeams[1].name,
    crest: props.selectedTeams[1].crest,
    tla: props.selectedTeams[1].tla,
  };
});
// Dates
const dates = ref<DatePropsInterface>();
const start_at = ref<string>("");
const end_at = ref<string>("");
const winPercentage = ref<number>(10);
const lossPercentage = ref<number>(10);
const isActive = ref<boolean>(true);
const isEnded = ref<boolean>(false);

// Validation
const errors = ref<string[]>([]);

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Calculer l'exemple de gain/perte
const calculateWinExample = (amount: number) => {
  return amount + (amount * winPercentage.value) / 100;
};

const calculateLossExample = (amount: number) => {
  return amount - (amount * lossPercentage.value) / 100;
};

// Valider les données
const validateForm = (): boolean => {
  errors.value = [];

  if (winPercentage.value < 0 || winPercentage.value > 500) {
    errors.value.push("Le pourcentage de gain doit être entre 0% et 500%");
  }
  if (lossPercentage.value < 0 || lossPercentage.value > 100) {
    errors.value.push("Le pourcentage de perte doit être entre 0% et 100%");
  }

  return errors.value.length === 0;
};

// Confirmer la création du pari
const confirmBet = () => {
  if (props.selectedTeams.length != 2 || !validateForm()) {
    return;
  }

  const betData: BetCreationData = {
    id: Date.now(),
    score: otpCode.value.split("").join("-"),
    winner: winner.value,
    homeTeam: homeTeam.value,
    awayTeam: awayTeam.value,
    start_at: start_at.value,
    end_at: start_at.value,
    winPercentage: winPercentage.value,
    lossPercentage: lossPercentage.value,
    isActive: isActive.value,
    isEnded: isEnded.value,
  };

  emit("confirm", betData);
  betStore.addProtos(betData);
  closeDialog();
};

// Fermer le dialog
const closeDialog = () => {
  dialogValue.value = false;
};

// Réinitialiser les valeurs par défaut
const resetToDefaults = () => {
  otpCode.value = "00";
  dates.value = undefined;
  winPercentage.value = 10;
  lossPercentage.value = 10;
  isActive.value = true;
  isEnded.value = false;
  errors.value = [];
};

// Watcher pour réinitialiser quand le dialog s'ouvre
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetToDefaults();
    }
  }
);

// Watcher pour savoir le gagnant en fonction du score
watch(
  () => otpCode.value,
  (newValue) => {
    const list: number[] = [];
    newValue.split("").forEach((n) => {
      list.push(Number(n));
    });
    if (list[0] > list[1]) {
      winner.value = homeTeam.value.tla;
    } else if (list[0] < list[1]) {
      winner.value = homeTeam.value.tla;
    } else {
      winner.value = "draw";
    }
  }
);

// Watcher pour observer les differentes dates
watch(
  () => dates.value,
  (newValue) => {
    start_at.value = generateTime(newValue?.start);
    end_at.value = generateTime(newValue?.end);

    console.log("Start at : ", start_at.value);
    console.log("End at : ", end_at.value);
  }
);
</script>

<template>
  <v-dialog
    v-model="dialogValue"
    max-width="700px"
    max-height="700px"
    persistent
    scrollable
  >
    <v-card v-if="selectedTeams" rounded="lg">
      <!-- En-tête -->
      <v-card-title
        class="d-flex align-center justify-space-between bg-primary pa-4"
      >
        <div>
          <h3 class="text-h6 font-weight-bold">Configuration du pari</h3>
          <p class="text-caption text-white mb-0 opacity-90">
            Définissez les pourcentages
          </p>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          color="white"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <!-- Informations du match -->
        <v-sheet color="grey-lighten-4" rounded="lg" class="pa-4 mb-3">
          <div class="d-flex align-center justify-space-between">
            <!-- Équipe domicile -->
            <div class="text-center" style="flex: 1">
              <v-avatar size="60" class="mb-2">
                <v-img :src="homeTeam.crest"></v-img>
              </v-avatar>
              <div class="font-weight-bold">{{ homeTeam.name }}</div>
              <div class="text-caption text-grey-darken-1">
                {{ homeTeam.tla }}
              </div>
            </div>

            <!-- VS -->
            <v-sheet
              class="text-h5 font-weight-bold bg-transparent text-grey-darken-1 mx-4"
              max-width="200"
            >
              <v-otp-input
                v-model="otpCode"
                divider="VS"
                length="2"
                variant="outlined"
              ></v-otp-input>
            </v-sheet>

            <!-- Équipe extérieure -->
            <div class="text-center" style="flex: 1">
              <v-avatar size="60" class="mb-2">
                <v-img :src="awayTeam.crest"></v-img>
              </v-avatar>
              <div class="font-weight-bold">{{ awayTeam.name }}</div>
              <div class="text-caption text-grey-darken-1">
                {{ awayTeam.tla }}
              </div>
            </div>
          </div>
        </v-sheet>

        <div class="pb-4">
          <UiEventRangeDatePicker v-model:modelValue="dates" />
        </div>

        <!-- Messages d'erreur -->
        <v-alert
          v-if="errors.length > 0"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          <div class="text-body-2 font-weight-bold mb-2">
            Erreurs de validation :
          </div>
          <ul class="ml-4">
            <li
              v-for="(error, index) in errors"
              :key="index"
              class="text-caption"
            >
              {{ error }}
            </li>
          </ul>
        </v-alert>

        <!-- Configuration des pourcentages globaux -->
        <h4 class="text-h6 font-weight-bold mb-4 d-flex align-center">
          <PercentageIcon :size="24" class="mr-2" />
          Pourcentages globaux
        </h4>

        <v-row class="mb-4">
          <!-- Pourcentage de gain -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" rounded="lg" class="pa-4 border-sm">
              <div class="d-flex align-center mb-3">
                <v-avatar color="success" size="40" class="mr-3">
                  <v-icon color="white">mdi-trending-up</v-icon>
                </v-avatar>
                <div>
                  <h5 class="text-subtitle-1 font-weight-bold">
                    Gain en cas de réussite
                  </h5>
                  <p class="text-caption text-grey-darken-1 mb-0">
                    Pourcentage gagné sur la mise
                  </p>
                </div>
              </div>

              <v-slider
                v-model="winPercentage"
                :min="0"
                :max="100"
                :step="3"
                color="success"
                thumb-label
                hide-details
                class="mb-2"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="winPercentage"
                    type="number"
                    variant="outlined"
                    density="compact"
                    suffix="%"
                    style="width: 100px"
                    hide-details
                  ></v-text-field>
                </template>
              </v-slider>

              <v-divider class="my-5"></v-divider>

              <div class="text-caption text-grey-darken-1 mb-2">
                Exemples de gains :
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Solde 10 &#x244;</span>
                <span class="text-caption font-weight-bold text-success">
                  Solde + gains {{ calculateWinExample(10).toFixed(2) }}&#x244;
                </span>
              </div>
            </v-card>
          </v-col>

          <!-- Pourcentage de perte -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" rounded="lg" class="pa-4 border-sm">
              <div class="d-flex align-center mb-3">
                <v-avatar color="error" size="40" class="mr-3">
                  <v-icon color="white">mdi-trending-down</v-icon>
                </v-avatar>
                <div>
                  <h5 class="text-subtitle-1 font-weight-bold">
                    Perte en cas d'échec
                  </h5>
                  <p class="text-caption text-grey-darken-1 mb-0">
                    Pourcentage perdu sur la mise
                  </p>
                </div>
              </div>

              <v-slider
                v-model="lossPercentage"
                :min="0"
                :max="100"
                :step="6"
                color="error"
                thumb-label
                hide-details
                class=""
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="lossPercentage"
                    type="number"
                    variant="outlined"
                    density="compact"
                    suffix="%"
                    style="width: 100px"
                    hide-details
                  ></v-text-field>
                </template>
              </v-slider>

              <v-divider class="my-5"></v-divider>

              <div class="text-caption text-grey-darken-1 mb-2">
                Exemples de pertes :
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Solde: 10 &#x244;</span>
                <span class="text-caption font-weight-bold text-error">
                  Solde - Perte: {{ calculateLossExample(10).toFixed(2) }}
                  &#x244;
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card variant="outlined" rounded="lg" class="pa-4 border-sm">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon
                :color="isActive ? 'success' : 'grey'"
                size="large"
                class="mr-3"
              >
                {{ isActive ? "mdi-check-circle" : "mdi-cancel" }}
              </v-icon>
              <div>
                <h5 class="text-subtitle-1 font-weight-bold">Statut du pari</h5>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{
                    isActive
                      ? "Les utilisateurs peuvent parier"
                      : "Pari désactivé"
                  }}
                </p>
              </div>
            </div>
            <v-switch
              v-model="isActive"
              color="success"
              hide-details
              inset
            ></v-switch>
          </div>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-btn
          variant="outlined"
          color="primary"
          @click="resetToDefaults"
          rounded="lg"
          prepend-icon="mdi-refresh"
        >
          Réinitialiser
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          @click="confirmBet"
          size="large"
          rounded="lg"
        >
          Créer le pari
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.opacity-90 {
  opacity: 0.9;
}
</style>
