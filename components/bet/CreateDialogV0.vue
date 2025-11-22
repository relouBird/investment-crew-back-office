<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { MatchModel } from '~/types/api-bet.type'
import { CashIcon, ClockIcon, PercentageIcon } from 'vue-tabler-icons'

// Props
interface Props {
  match: MatchModel | null
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [betData: BetCreationData]
}>()

// Types
interface BetCreationData {
  matchId: number
  winPercentage: number
  lossPercentage: number
  minBetAmount: number
  maxBetAmount: number
  isActive: boolean
}

// Données réactives
const winPercentage = ref<number>(100)
const lossPercentage = ref<number>(100)
const minBetAmount = ref<number>(5)
const maxBetAmount = ref<number>(1000)
const isActive = ref<boolean>(true)

// Validation
const errors = ref<string[]>([])

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Formater la date et l'heure
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

// Calculer l'exemple de gain/perte
const calculateWinExample = (amount: number) => {
  return amount + (amount * winPercentage.value / 100)
}

const calculateLossExample = (amount: number) => {
  return amount - (amount * lossPercentage.value / 100)
}

// Valider les données
const validateForm = (): boolean => {
  errors.value = []

  if (winPercentage.value < 0 || winPercentage.value > 500) {
    errors.value.push('Le pourcentage de gain doit être entre 0% et 500%')
  }
  if (lossPercentage.value < 0 || lossPercentage.value > 100) {
    errors.value.push('Le pourcentage de perte doit être entre 0% et 100%')
  }
  if (minBetAmount.value <= 0) {
    errors.value.push('Le montant minimum doit être supérieur à 0')
  }
  if (maxBetAmount.value <= minBetAmount.value) {
    errors.value.push('Le montant maximum doit être supérieur au montant minimum')
  }

  return errors.value.length === 0
}

// Confirmer la création du pari
const confirmBet = () => {
  if (!props.match || !validateForm()) {
    return
  }

  const betData: BetCreationData = {
    matchId: props.match.id,
    winPercentage: winPercentage.value,
    lossPercentage: lossPercentage.value,
    minBetAmount: minBetAmount.value,
    maxBetAmount: maxBetAmount.value,
    isActive: isActive.value
  }

  emit('confirm', betData)
  closeDialog()
}

// Fermer le dialog
const closeDialog = () => {
  dialogValue.value = false
}

// Réinitialiser les valeurs par défaut
const resetToDefaults = () => {
  winPercentage.value = 100
  lossPercentage.value = 100
  minBetAmount.value = 5
  maxBetAmount.value = 1000
  isActive.value = true
  errors.value = []
}

// Watcher pour réinitialiser quand le dialog s'ouvre
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetToDefaults()
  }
})
</script>

<template>
  <v-dialog
    v-model="dialogValue"
    max-width="700px"
    persistent
    scrollable
  >
    <v-card v-if="match">
      <!-- En-tête -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 bg-primary">
        <div>
          <h3 class="text-h6 font-weight-bold text-white">Configuration du pari</h3>
          <p class="text-caption text-white mb-0 opacity-90">
            Définissez les pourcentages globaux pour ce match
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
        <v-sheet color="grey-lighten-4" rounded="lg" class="pa-4 mb-6">
          <div class="d-flex align-center justify-center mb-3">
            <ClockIcon :size="18" class="text-grey-darken-1 mr-2" />
            <span class="text-body-2 text-grey-darken-1 font-weight-medium">
              {{ formatDateTime(match.utcDate).date }} à {{ formatDateTime(match.utcDate).time }}
            </span>
          </div>
          
          <div class="d-flex align-center justify-space-between">
            <!-- Équipe domicile -->
            <div class="text-center" style="flex: 1;">
              <v-avatar size="60" class="mb-2">
                <v-img :src="match.homeTeam.crest"></v-img>
              </v-avatar>
              <div class="font-weight-bold">{{ match.homeTeam.name }}</div>
              <div class="text-caption text-grey-darken-1">{{ match.homeTeam.tla }}</div>
            </div>

            <!-- VS -->
            <div class="text-h5 font-weight-bold text-grey-darken-1 mx-6">VS</div>

            <!-- Équipe extérieure -->
            <div class="text-center" style="flex: 1;">
              <v-avatar size="60" class="mb-2">
                <v-img :src="match.awayTeam.crest"></v-img>
              </v-avatar>
              <div class="font-weight-bold">{{ match.awayTeam.name }}</div>
              <div class="text-caption text-grey-darken-1">{{ match.awayTeam.tla }}</div>
            </div>
          </div>
        </v-sheet>

        <!-- Messages d'erreur -->
        <v-alert
          v-if="errors.length > 0"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          <div class="text-body-2 font-weight-bold mb-2">Erreurs de validation :</div>
          <ul class="ml-4">
            <li v-for="(error, index) in errors" :key="index" class="text-caption">
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
            <v-card variant="outlined" rounded="lg" class="pa-4 h-100 border-sm">
              <div class="d-flex align-center mb-3">
                <v-avatar color="success" size="40" class="mr-3">
                  <v-icon color="white">mdi-trending-up</v-icon>
                </v-avatar>
                <div>
                  <h5 class="text-subtitle-1 font-weight-bold">Gain en cas de réussite</h5>
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
                class="mb-2"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="winPercentage"
                    type="number"
                    variant="outlined"
                    density="compact"
                    suffix="%"
                    style="width: 100px;"
                    hide-details
                  ></v-text-field>
                </template>
              </v-slider>

              <v-divider class="my-3"></v-divider>

              <div class="text-caption text-grey-darken-1 mb-2">Exemples de gains :</div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Mise 10€ :</span>
                <span class="text-caption font-weight-bold text-success">
                  {{ calculateWinExample(10).toFixed(2) }}€
                </span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Mise 50€ :</span>
                <span class="text-caption font-weight-bold text-success">
                  {{ calculateWinExample(50).toFixed(2) }}€
                </span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption">Mise 100€ :</span>
                <span class="text-caption font-weight-bold text-success">
                  {{ calculateWinExample(100).toFixed(2) }}€
                </span>
              </div>
            </v-card>
          </v-col>

          <!-- Pourcentage de perte -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" rounded="lg" class="pa-4 h-100 border-sm">
              <div class="d-flex align-center mb-3">
                <v-avatar color="error" size="40" class="mr-3">
                  <v-icon color="white">mdi-trending-down</v-icon>
                </v-avatar>
                <div>
                  <h5 class="text-subtitle-1 font-weight-bold">Perte en cas d'échec</h5>
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
                class="mb-2"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="lossPercentage"
                    type="number"
                    variant="outlined"
                    density="compact"
                    suffix="%"
                    style="width: 100px;"
                    hide-details
                  ></v-text-field>
                </template>
              </v-slider>

              <v-divider class="my-3"></v-divider>

              <div class="text-caption text-grey-darken-1 mb-2">Exemples de pertes :</div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Mise 10€ :</span>
                <span class="text-caption font-weight-bold text-error">
                  {{ calculateLossExample(10).toFixed(2) }}€
                </span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">Mise 50€ :</span>
                <span class="text-caption font-weight-bold text-error">
                  {{ calculateLossExample(50).toFixed(2) }}€
                </span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption">Mise 100€ :</span>
                <span class="text-caption font-weight-bold text-error">
                  {{ calculateLossExample(100).toFixed(2) }}€
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Récapitulatif visuel -->
        <v-card color="primary" variant="tonal" class="pa-4 mb-4" rounded="lg">
          <div class="d-flex align-center justify-center">
            <div class="text-center mx-4">
              <div class="text-h4 font-weight-bold text-success mb-1">
                +{{ winPercentage }}%
              </div>
              <div class="text-caption">En cas de réussite</div>
            </div>
            <v-divider vertical class="mx-4"></v-divider>
            <div class="text-center mx-4">
              <div class="text-h4 font-weight-bold text-error mb-1">
                -{{ lossPercentage }}%
              </div>
              <div class="text-caption">En cas d'échec</div>
            </div>
          </div>
        </v-card>

        <!-- Limites de mise -->
        <v-divider class="my-6"></v-divider>
        
        <h4 class="text-h6 font-weight-bold mb-5 d-flex align-center ga-2">
          <CashIcon />
          Limites de mise
        </h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="minBetAmount"
              label="Montant minimum"
              type="number"
              variant="outlined"
              color="primary"
              prefix="&#x244;"
              hint="Mise minimale autorisée"
              persistent-hint
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-arrow-down</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="maxBetAmount"
              label="Montant maximum"
              type="number"
              variant="outlined"
              color="primary"
              prefix="&#x244;"
              hint="Mise maximale autorisée"
              persistent-hint
            >
              <template v-slot:prepend-inner>
                <v-icon color="primary">mdi-arrow-up</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Statut du pari -->
        <v-divider class="my-6"></v-divider>
        
        <v-card variant="outlined" rounded="lg" class="pa-4 border-sm">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon :color="isActive ? 'success' : 'grey'" size="large" class="mr-3">
                {{ isActive ? 'mdi-check-circle' : 'mdi-cancel' }}
              </v-icon>
              <div>
                <h5 class="text-subtitle-1 font-weight-bold">Statut du pari</h5>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{ isActive ? 'Les utilisateurs peuvent parier' : 'Pari désactivé' }}
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
          variant="text"
          @click="closeDialog"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="confirmBet"
          append-icon="mdi-check"
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
.h-100 {
  height: 100%;
}

.opacity-90 {
  opacity: 0.9;
}
</style>