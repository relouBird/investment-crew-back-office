<template>
  <div>
    <!-- Date & heure de début -->
    <div>
      <h4 class="text-subtitle-1 font-weight-medium mb-2">Début</h4>

      <div class="d-lg-flex ga-2">
        <!-- DATE -->
        <v-menu v-model="menuStartDate" :close-on-content-click="true">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Date de début"
              color="primary"
              readonly
              variant="outlined"
              :model-value="formatDate(startDate)"
            />
          </template>

          <v-date-picker v-model="startDate" />
        </v-menu>

        <!-- HEURE -->
        <v-menu v-model="menuStartTime" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Heure de début"
              color="primary"
              readonly
              variant="outlined"
              :model-value="startTime"
            />
          </template>

          <v-time-picker
            v-model="startTime"
            format="24hr"
            @update:minute="menuStartTime = false"
          />
        </v-menu>
      </div>
    </div>

    <!-- Date & heure de fin -->
    <div class="mt-6">
      <h4 class="text-subtitle-1 font-weight-medium mb-2">Fin</h4>

      <div class="d-lg-flex ga-2">
        <v-menu v-model="menuEndDate" :close-on-content-click="true">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Date de fin"
              color="primary"
              readonly
              variant="outlined"
              :model-value="formatDate(endDate)"
            />
          </template>

          <v-date-picker v-model="endDate" />
        </v-menu>

        <v-menu v-model="menuEndTime" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Heure de fin"
              color="primary"
              readonly
              variant="outlined"
              :model-value="endTime"
            />
          </template>

          <v-time-picker
            v-model="endTime"
            format="24hr"
            v-on:update:minute="menuEndTime = false"
          />
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "~/helpers";
import type { DatePropsInterface } from "~/types";

// Model v-model
const model = defineModel<DatePropsInterface>({
  default: () => ({
    start: { date: "", time: "" },
    end: { date: "", time: "" },
  }),
});

// États locaux
const startDate = ref(model.value.start.date);
const startTime = ref(model.value.start.time);
const endDate = ref(model.value.end.date);
const endTime = ref(model.value.end.time);

// Menus
const menuStartDate = ref(false);
const menuStartTime = ref(false);
const menuEndDate = ref(false);
const menuEndTime = ref(false);

// Sync avec parent
watch([startDate, startTime, endDate, endTime], () => {
  model.value = {
    start: { date: startDate.value, time: startTime.value },
    end: { date: endDate.value, time: endTime.value },
  };
});
</script>
