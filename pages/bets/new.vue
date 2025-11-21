<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import useBetApiStore from '~/stores/bet-api.store'
import type { CompetitionModel, MatchModel } from '~/types/api-bet.type'
import { TrophyIcon, CalendarIcon, ClockIcon, CircleCheckIcon } from 'vue-tabler-icons'

// Stores
const betApiStore = useBetApiStore()

// Valeurs réactives
const competitions = computed(() => betApiStore.getCompetitions)
const matches = ref<MatchModel[]>([])
const selectedCompetition = ref<CompetitionModel | null>(null)
const isLoadingCompetitions = ref<boolean>(false)
const isLoadingMatches = ref<boolean>(false)
const selectedMatch = ref<MatchModel | null>(null)
const showBetDialog = ref(false)

// Données du pari
const betType = ref<'home' | 'draw' | 'away' | null>(null)
const betAmount = ref<number | null>(null)
const potentialGain = ref<number>(0)

// Odds fictifs (tu peux les remplacer par tes vraies odds depuis l'API)
const getOdds = (match: MatchModel) => {
  return {
    home: 2.10,
    draw: 3.20,
    away: 3.50
  }
}

// Chargement des compétitions
const loadCompetitions = async () => {
  try {
    isLoadingCompetitions.value = true
    await betApiStore.fetchCompetitions()
  } catch (e) {
    console.error('Erreur lors du chargement des compétitions:', e)
  } finally {
    isLoadingCompetitions.value = false
  }
}

// Chargement des matchs d'une compétition
const loadMatches = async (competitionId: number) => {
  try {
    isLoadingMatches.value = true
    // Appelle ta méthode du store pour charger les matchs
    matches.value = await betApiStore.fetchMatchsCompetition(competitionId)
  } catch (e) {
    console.error('Erreur lors du chargement des matchs:', e)
  } finally {
    isLoadingMatches.value = false
  }
}

// Sélection d'une compétition
const selectCompetition = async (competition: CompetitionModel) => {
  selectedCompetition.value = competition
  await loadMatches(competition.id)
}

// Retour à la liste des compétitions
const backToCompetitions = () => {
  selectedCompetition.value = null
  matches.value = []
  selectedMatch.value = null
}

// Ouvrir le modal de pari
const openBetDialog = (match: MatchModel) => {
  selectedMatch.value = match
  betType.value = null
  betAmount.value = null
  potentialGain.value = 0
  showBetDialog.value = true
}

// Fermer le modal
const closeBetDialog = () => {
  showBetDialog.value = false
  selectedMatch.value = null
  betType.value = null
  betAmount.value = null
  potentialGain.value = 0
}

// Sélectionner un type de pari
const selectBetType = (type: 'home' | 'draw' | 'away') => {
  betType.value = type
  calculatePotentialGain()
}

// Calculer le gain potentiel
const calculatePotentialGain = () => {
  if (betAmount.value && betType.value && selectedMatch.value) {
    const odds = getOdds(selectedMatch.value)
    const selectedOdd = betType.value === 'home' ? odds.home : 
                        betType.value === 'draw' ? odds.draw : odds.away
    potentialGain.value = betAmount.value * selectedOdd
  } else {
    potentialGain.value = 0
  }
}

// Confirmer le pari
const confirmBet = () => {
  if (!betAmount.value || !betType.value || !selectedMatch.value) {
    return
  }

  // Logique pour sauvegarder le pari
  console.log('Pari confirmé:', {
    match: selectedMatch.value,
    type: betType.value,
    amount: betAmount.value,
    potentialGain: potentialGain.value
  })

  // Fermer le modal
  closeBetDialog()
}

// Grouper les matchs par date
const matchesByDate = computed(() => {
  const grouped: Record<string, MatchModel[]> = {}
  matches.value.forEach(match => {
    const date = new Date(match.utcDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(match)
  })
  return grouped
})

// Formater la date et l'heure
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

// Obtenir le badge de statut
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'FINISHED':
      return { color: 'grey', text: 'Terminé' }
    case 'LIVE':
    case 'IN_PLAY':
      return { color: 'error', text: 'En cours' }
    case 'SCHEDULED':
    case 'TIMED':
      return { color: 'primary', text: 'À venir' }
    case 'POSTPONED':
      return { color: 'warning', text: 'Reporté' }
    default:
      return { color: 'grey', text: status }
  }
}

// Formater la devise
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Obtenir le nom du type de pari
const getBetTypeName = (type: 'home' | 'draw' | 'away'): string => {
  if (!selectedMatch.value) return ''
  switch (type) {
    case 'home':
      return selectedMatch.value.homeTeam.name
    case 'draw':
      return 'Match Nul'
    case 'away':
      return selectedMatch.value.awayTeam.name
    default:
      return ''
  }
}

onMounted(async () => {
  await loadCompetitions()
})
</script>

<template>
  <div>
    <!-- En-tête -->
    <div class="mb-6">
      <v-btn
        v-if="selectedCompetition"
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="backToCompetitions"
        class="mb-4"
      >
        Retour aux compétitions
      </v-btn>
      
      <h1 class="text-h4 font-weight-bold mb-2">
        {{ selectedCompetition ? selectedCompetition.name : 'Créer un pari' }}
      </h1>
      <p class="text-grey-darken-1">
        {{ selectedCompetition 
          ? 'Sélectionnez un match pour parier' 
          : 'Choisissez une compétition pour commencer' 
        }}
      </p>
    </div>

    <!-- Liste des compétitions -->
    <div v-if="!selectedCompetition">
      <!-- Loading -->
      <div v-if="isLoadingCompetitions" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-grey-darken-1 mt-4">Chargement des compétitions...</p>
      </div>

      <!-- Grille des compétitions -->
      <v-row v-else>
        <v-col
          v-for="competition in competitions"
          :key="competition.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            hover
            class="competition-card"
            @click="selectCompetition(competition)"
          >
            <v-card-text class="pa-4">
              <div class="d-flex flex-column align-center text-center">
                <!-- Emblème de la compétition -->
                <v-avatar
                  size="80"
                  class="mb-3"
                  :color="competition.emblem ? 'transparent' : 'grey-lighten-3'"
                >
                  <v-img
                    v-if="competition.emblem"
                    :src="competition.emblem"
                    :alt="competition.name"
                    cover
                  ></v-img>
                  <TrophyIcon v-else :size="40" color="grey" />
                </v-avatar>

                <!-- Nom de la compétition -->
                <h3 class="text-subtitle-1 font-weight-bold mb-2">
                  {{ competition.name }}
                </h3>

                <!-- Région/Pays -->
                <div class="d-flex align-center mb-2">
                  <span v-if="competition.area?.flag" class="mr-2">
                    {{ competition.area.flag }}
                  </span>
                  <span v-if="competition.area?.name" class="text-caption text-grey-darken-1">
                    {{ competition.area.name }}
                  </span>
                </div>

                <!-- Infos supplémentaires -->
                <v-chip
                  size="small"
                  :color="competition.type === 'LEAGUE' ? 'primary' : 'secondary'"
                  variant="flat"
                >
                  {{ competition.type }}
                </v-chip>

                <div v-if="competition.currentSeason" class="mt-2">
                  <span class="text-caption text-grey-darken-1">
                    Journée {{ competition.currentSeason.currentMatchday }}
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Liste des matchs -->
    <div v-else>
      <!-- Loading -->
      <div v-if="isLoadingMatches" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-grey-darken-1 mt-4">Chargement des matchs...</p>
      </div>

      <!-- Liste des matchs groupés par date -->
      <div v-else>
        <div
          v-for="(matchList, date) in matchesByDate"
          :key="date"
          class="mb-6"
        >
          <!-- En-tête de date -->
          <div class="d-flex align-center mb-3">
            <CalendarIcon :size="24" class="text-primary mr-2" />
            <h3 class="text-h6 font-weight-medium text-capitalize">{{ date }}</h3>
          </div>

          <!-- Cartes de matchs -->
          <v-card
            v-for="match in matchList"
            :key="match.id"
            class="mb-3 match-card"
            hover
            @click="openBetDialog(match)"
          >
            <v-card-text class="pa-4">
              <v-row align="center">
                <!-- Date et heure -->
                <v-col cols="12" sm="2" class="text-center">
                  <div class="match-time">
                    <div class="text-caption text-grey-darken-1">
                      {{ formatDateTime(match.utcDate).date }}
                    </div>
                    <div class="d-flex align-center justify-center my-2">
                      <ClockIcon :size="20" class="text-primary mr-1" />
                      <span class="text-h6 font-weight-bold text-primary">
                        {{ formatDateTime(match.utcDate).time }}
                      </span>
                    </div>
                    <v-chip
                      size="x-small"
                      :color="getStatusBadge(match.status).color"
                      variant="flat"
                      class="mt-1"
                    >
                      {{ getStatusBadge(match.status).text }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Équipes -->
                <v-col cols="12" sm="8">
                  <div class="d-flex align-center justify-space-between">
                    <!-- Équipe domicile -->
                    <div class="d-flex align-center flex-grow-1">
                      <v-avatar size="40" class="mr-3">
                        <v-img :src="match.homeTeam.crest" :alt="match.homeTeam.name"></v-img>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="font-weight-medium">{{ match.homeTeam.name }}</div>
                        <div class="text-caption text-grey-darken-1">{{ match.homeTeam.tla }}</div>
                      </div>
                      <div
                        v-if="match.score.fullTime.home !== null"
                        class="text-h5 font-weight-bold mx-4"
                      >
                        {{ match.score.fullTime.home }}
                      </div>
                    </div>

                    <!-- VS -->
                    <div class="mx-4 text-grey-darken-1 font-weight-medium">VS</div>

                    <!-- Équipe extérieure -->
                    <div class="d-flex align-center flex-grow-1 flex-row-reverse">
                      <v-avatar size="40" class="ml-3">
                        <v-img :src="match.awayTeam.crest" :alt="match.awayTeam.name"></v-img>
                      </v-avatar>
                      <div class="flex-grow-1 text-right">
                        <div class="font-weight-medium">{{ match.awayTeam.name }}</div>
                        <div class="text-caption text-grey-darken-1">{{ match.awayTeam.tla }}</div>
                      </div>
                      <div
                        v-if="match.score.fullTime.away !== null"
                        class="text-h5 font-weight-bold mx-4"
                      >
                        {{ match.score.fullTime.away }}
                      </div>
                    </div>
                  </div>

                  <!-- Infos match -->
                  <div class="d-flex align-center mt-2">
                    <v-chip size="x-small" variant="text" class="mr-2">
                      <TrophyIcon :size="14" class="mr-1" />
                      Journée {{ match.matchday }}
                    </v-chip>
                    <v-chip v-if="match.stage" size="x-small" variant="text">
                      {{ match.stage }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Action -->
                <v-col cols="12" sm="2" class="text-center">
                  <v-btn
                    color="primary"
                    variant="flat"
                    block
                    :disabled="match.status !== 'SCHEDULED' && match.status !== 'TIMED'"
                  >
                    Parier
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Message si aucun match -->
        <v-alert
          v-if="Object.keys(matchesByDate).length === 0"
          type="info"
          variant="tonal"
          class="text-center"
        >
          Aucun match disponible pour cette compétition
        </v-alert>
      </div>
    </div>

    <!-- Modal de création de pari -->
    <v-dialog
      v-model="showBetDialog"
      max-width="600px"
      persistent
    >
      <v-card v-if="selectedMatch">
        <!-- En-tête du modal -->
        <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
          <div>
            <h3 class="text-h6 font-weight-bold">Créer un pari</h3>
            <p class="text-caption text-grey-darken-1 mb-0">
              {{ selectedCompetition?.name }} - Journée {{ selectedMatch.matchday }}
            </p>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="closeBetDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Informations du match -->
          <div class="match-info-card pa-4 rounded-lg mb-4" style="background-color: #f5f5f5;">
            <div class="d-flex align-center justify-center mb-3">
              <ClockIcon :size="18" class="text-grey-darken-1 mr-2" />
              <span class="text-caption text-grey-darken-1">
                {{ formatDateTime(selectedMatch.utcDate).date }} à {{ formatDateTime(selectedMatch.utcDate).time }}
              </span>
            </div>
            
            <div class="d-flex align-center justify-space-between">
              <!-- Équipe domicile -->
              <div class="text-center" style="flex: 1;">
                <v-avatar size="60" class="mb-2">
                  <v-img :src="selectedMatch.homeTeam.crest"></v-img>
                </v-avatar>
                <div class="font-weight-medium">{{ selectedMatch.homeTeam.name }}</div>
              </div>

              <!-- VS -->
              <div class="text-h6 font-weight-bold text-grey-darken-1 mx-4">VS</div>

              <!-- Équipe extérieure -->
              <div class="text-center" style="flex: 1;">
                <v-avatar size="60" class="mb-2">
                  <v-img :src="selectedMatch.awayTeam.crest"></v-img>
                </v-avatar>
                <div class="font-weight-medium">{{ selectedMatch.awayTeam.name }}</div>
              </div>
            </div>
          </div>

          <!-- Sélection du type de pari -->
          <div class="mb-4">
            <h4 class="text-subtitle-2 font-weight-bold mb-3">Choisissez votre pronostic</h4>
            <v-row>
              <v-col cols="4">
                <v-card
                  :class="['bet-type-card', { 'selected': betType === 'home' }]"
                  @click="selectBetType('home')"
                  hover
                >
                  <v-card-text class="text-center pa-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Victoire</div>
                    <div class="font-weight-bold mb-1">{{ selectedMatch.homeTeam.tla }}</div>
                    <v-chip size="small" color="primary" variant="flat">
                      {{ getOdds(selectedMatch).home }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="4">
                <v-card
                  :class="['bet-type-card', { 'selected': betType === 'draw' }]"
                  @click="selectBetType('draw')"
                  hover
                >
                  <v-card-text class="text-center pa-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Match</div>
                    <div class="font-weight-bold mb-1">Nul</div>
                    <v-chip size="small" color="primary" variant="flat">
                      {{ getOdds(selectedMatch).draw }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="4">
                <v-card
                  :class="['bet-type-card', { 'selected': betType === 'away' }]"
                  @click="selectBetType('away')"
                  hover
                >
                  <v-card-text class="text-center pa-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Victoire</div>
                    <div class="font-weight-bold mb-1">{{ selectedMatch.awayTeam.tla }}</div>
                    <v-chip size="small" color="primary" variant="flat">
                      {{ getOdds(selectedMatch).away }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Montant du pari -->
          <div class="mb-4">
            <h4 class="text-subtitle-2 font-weight-bold mb-3">Montant du pari</h4>
            <v-text-field
              v-model.number="betAmount"
              type="number"
              label="Montant"
              prefix="€"
              variant="outlined"
              color="primary"
              :disabled="!betType"
              @input="calculatePotentialGain"
            ></v-text-field>

            <!-- Suggestions de montants -->
            <div class="d-flex gap-2">
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="betAmount = 10; calculatePotentialGain()"
                :disabled="!betType"
              >
                10€
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="betAmount = 20; calculatePotentialGain()"
                :disabled="!betType"
              >
                20€
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="betAmount = 50; calculatePotentialGain()"
                :disabled="!betType"
              >
                50€
              </v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="betAmount = 100; calculatePotentialGain()"
                :disabled="!betType"
              >
                100€
              </v-btn>
            </div>
          </div>

          <!-- Récapitulatif -->
          <v-card v-if="betType && betAmount" color="primary" variant="tonal" class="pa-4">
            <div class="d-flex align-center justify-between mb-2">
              <span class="text-body-2">Pronostic :</span>
              <span class="font-weight-bold">{{ getBetTypeName(betType) }}</span>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span class="text-body-2">Mise :</span>
              <span class="font-weight-bold">{{ formatCurrency(betAmount) }}</span>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span class="text-body-2">Cote :</span>
              <span class="font-weight-bold">
                {{ betType === 'home' ? getOdds(selectedMatch).home : 
                   betType === 'draw' ? getOdds(selectedMatch).draw : 
                   getOdds(selectedMatch).away }}
              </span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex align-center justify-between">
              <span class="text-body-1 font-weight-bold">Gain potentiel :</span>
              <span class="text-h6 font-weight-bold text-success">
                {{ formatCurrency(potentialGain) }}
              </span>
            </div>
          </v-card>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="pa-4 border-t">
          <v-btn
            variant="text"
            @click="closeBetDialog"
          >
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!betType || !betAmount || betAmount <= 0"
            @click="confirmBet"
            prepend-icon="mdi-check"
          >
            Confirmer le pari
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.competition-card {
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.competition-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.match-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.match-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.match-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bet-type-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.bet-type-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.bet-type-card.selected {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}

@media (max-width: 600px) {
  .match-time {
    margin-bottom: 16px;
  }
}
</style>