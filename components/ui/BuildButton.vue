<script lang="ts" setup>
import type { TablerIconComponent } from "vue-tabler-icons";

export interface BuildButtonProps {
  vModel?: string;
  color: string;
  label: string;
  variant:
    | "outlined"
    | "filled"
    | "plain"
    | "underlined"
    | "solo"
    | "solo-inverted"
    | "solo-filled"
    | undefined;
  density: undefined | "default" | "comfortable" | "compact";
  class: string;
  type?: string;
  placeholder?: string;
  readonly: boolean;
  bgColor: boolean;
  icon: TablerIconComponent;
}

const props = defineProps<BuildButtonProps>();

const emit = defineEmits<{
  "update:vModel": [value?: string];
}>();

const modelValue = computed({
  get: () => props.vModel,
  set: (value) => {
    emit("update:vModel", value);
  },
});
</script>
<template>
  <v-text-field
    v-model="modelValue"
    :color="color"
    :label="label"
    :variant="variant"
    :density="density"
    :class="class"
    :type="type"
    :placeholder="placeholder"
    :readonly="readonly"
    :bg-color="bgColor ? 'grey-lighten-4' : 'white'"
  >
    <template v-slot:prepend-inner>
      <component :is="icon" class="text-grey-darken-2" size="24" />
    </template>
  </v-text-field>
</template>
<style></style>
