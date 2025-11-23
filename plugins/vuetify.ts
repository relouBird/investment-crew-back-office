// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// Import des pickers (si nécessaire)
import { VTimePicker } from "vuetify/labs/components";
import { lighten } from "vuetify/lib/util/colorUtils.mjs";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      VTimePicker,
    },
    directives,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1e3a8a",
          },
        },
      },
    },
    defaults: {
      global: {
        style: "font-family: inherit !important;",
      },
      VCard: {
        VCardTitle: {
          style: "font-family: 'Montserrat'; font-weight: 700;",
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
