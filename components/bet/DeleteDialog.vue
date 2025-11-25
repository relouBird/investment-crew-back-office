<script setup lang="ts">
import useBetStore from "~/stores/bet.store";
import type { BetModel } from "~/types/api-bet.type";

// Type pour propriétés
type PropsType = {
  modelValue: string;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelValue"]);

// variables réactives...
const betStore = useBetStore();
const activeBet = computed(
  () => betStore.selected as BetModel
);

const isActive = ref<boolean>(false);

// fonctions utiles
const deleteBet = async () => {
  try {
    await betStore.remove();
  } catch (error) {
    console.log("error ====>", error);
  } finally {
    emit("update:modelValue", "");
  }
};

// watchers...
watch(
  () => props.modelValue,
  async (newValue) => {
    isActive.value = newValue != undefined && newValue == "delete";

    if (newValue != undefined && newValue != "") {
      await deleteBet();
    }
  }
);
</script>

<template>
  <div>
    <v-dialog v-model="isActive" :max-width="300" persistent>
      <ui-custom-loader title="Suppression du pari..." />
    </v-dialog>
  </div>
</template>
