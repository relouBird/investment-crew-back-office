<script lang="ts" setup>
import useBetApiStore from "~/stores/bet-api.store";
import type {  TeamModel } from "~/types/api-bet.type";

// Stores
const betApiStore = useBetApiStore();

// Valeurs réactives
const competitions = computed(() => betApiStore.getCompetitions);
const teams = computed(() => betApiStore.getTeams ?? []);
const selectedCompetition = computed(() => betApiStore.selectedCompetition);
const selectedTeams = ref<TeamModel[]>([]);

const isLoadingCompetitions = ref<boolean>(false);
const isLoadingTeams = ref<boolean>(false);
const openModal = ref<boolean>(false);

// Chargement des compétitions
const loadCompetitions = async () => {
  try {
    isLoadingCompetitions.value = true;
    await betApiStore.fetchCompetitions();
  } catch (e) {
    console.log("Erreur lors du chargement des compétitions:", e);
  } finally {
    isLoadingCompetitions.value = false;
  }
};

// Chargement des matchs d'une compétition
const loadTeams = async (competitionId: number) => {
  try {
    isLoadingTeams.value = true;
    // Appelle ta méthode du store pour charger les matchs
    await betApiStore.fetchTeamsCompetition(competitionId);
  } catch (e) {
    console.log("Erreur lors du chargement des matchs:", e);
  } finally {
    isLoadingTeams.value = false;
  }
};

// Ouvre la modal...
const handleClick = () => {
  if (selectedTeams.value.length == 2) {
    openModal.value = true;
  }
};

// Retour à la liste des compétitions
const backToCompetitions = () => {
  betApiStore.removeSelectedCompetition();
};

onMounted(async () => {
  /*
  Désactive et reactive ceci pour observer des choses...
  */
  // betApiStore.removeSelectedCompetition();
  await loadCompetitions();
});

watch(
  () => selectedCompetition.value,
  (newCompetition) => {
    if (newCompetition) {
      loadTeams(newCompetition.id);
    }
  }
);
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

      <div class="d-lg-flex justify-space-between align-end">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            {{
              selectedCompetition ? selectedCompetition.name : "Créer un pari"
            }}
          </h1>
          <p class="text-grey-darken-1">
            {{
              selectedCompetition
                ? "Sélectionnez un match pour parier"
                : "Choisissez une compétition pour commencer"
            }}
          </p>
        </div>

        <v-btn
          v-if="selectedTeams.length == 2"
          color="primary"
          prepend-icon="mdi-plus"
          @click="handleClick"
          rounded="lg"
          elevation="0"
          class="mb-4"
        >
          Creer pari
        </v-btn>
      </div>
    </div>

    <!-- Liste des compétitions -->
    <div v-if="!selectedCompetition">
      <BetCompetitionsTable
        :competitions="competitions ?? []"
        :is-loading="isLoadingCompetitions"
      />
    </div>

    <!-- Liste des matchs -->
    <div v-else>
      <BetTeamsTable
        :teams="teams"
        :selected-teams="selectedTeams"
        :is-loading="isLoadingTeams"
      />
    </div>

    <BetCreateDialog :selected-teams="selectedTeams" v-model="openModal" />
  </div>
</template>

<style scoped>
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
</style>
