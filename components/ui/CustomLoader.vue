<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  title: string;
};

// Definitions des propriété du composant
const props = defineProps<PropsType>();
</script>

<template>
  <v-list class="py-2" color="primary" elevation="12" rounded="lg">
    <v-list-item :title="title">
      <template v-slot:append>
        <div class="pl-2">
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>
