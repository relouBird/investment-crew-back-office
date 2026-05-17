<script setup lang="ts">
import IMG1 from "~/assets/images/payments/logo-momo.jpg";
import IMG2 from "~/assets/images/payments/orange-money.jpg";
import * as yup from "yup";
import { WalletDepositConversion } from "~/helpers/wallet-help";
import type { EventPayment } from "~/types";
import useWalletStore from "~/stores/wallet.store";
import useTransactionStore from "~/stores/transaction.store";
import { notify } from "~/helpers/notifications";

const props = defineProps<{
  modelValue: boolean;
}>();

const { $emitter } = useNuxtApp();

// gestion des stores
const walletStore = useWalletStore();
const transactionStore = useTransactionStore();

const emit = defineEmits(["update:modelValue"]);

// reactives data
const loading = ref<boolean>(false);

// 🔹 Créer un formulaire réactif
const form = useForm(
  // Schéma de validation Yup
  yup.object().shape({
    phone: yup.string().min(9, "Ce n'est pas un numéro").required(),
    amount: yup.number().min(5, "Minimum un depot est de 500.").required(),
    payment: yup.string().required("Password is required"),
  })
);

// Payment methods
const paymentMethods = [
  { title: "Orange Money", value: "cm.orange", img: IMG2 },
  { title: "Mobile Money", value: "cm.mtn", img: IMG1 },
];

// Méthodes
const processDeposit = async () => {
  loading.value = true;

  try {
    await form.submit(async () => {
      const dataToRefill = WalletDepositConversion(form.data);
      console.log("props =>", dataToRefill);
      return await walletStore.refillWallet(dataToRefill);
    });

    form.clear();
    emit("update:modelValue", false);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  emit("update:modelValue", false);
};

nextTick(() => {
  $emitter.on("payment:started", (data) => {
    const dataIncomme = data as EventPayment;
    console.log("data =>", dataIncomme.status);
    let propsData = setInterval(async () => {
      let data = await walletStore.find(dataIncomme.id);
      if (walletStore.selectedTransaction?.status == "failed") {
        clearInterval(propsData);
        notify({
          color: "error",
          message: "The Transaction has failed...",
          visible: true,
        });
      } else if (walletStore.selectedTransaction?.status == "done") {
        clearInterval(propsData);
        notify({
          color: "success",
          message: "The Transaction has successful done...",
          visible: true,
        });
        walletStore.wallet = walletStore.wallet;
        walletStore.statistic =  walletStore.statistic && {...walletStore.statistic, balance: Number(walletStore.wallet?.funds)}
      } else {
        // CONTINUE
      }
    }, 15000);
  });
});
</script>

<template>
  <!-- Deposit Dialog -->
  <v-dialog
    v-model="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="450px"
  >
    <v-card elevation="0">
      <v-card-title class="text-h6 font-montserrat"
        >Effectuer un dépôt</v-card-title
      >
      <v-card-text>
        <form class="form">
          <v-text-field
            v-model="form.data.amount"
            :error-messages="form.errors.amount"
            @change="form.validateField('amount')"
            label="Montant"
            type="number"
            prefix="&#x244;"
            variant="outlined"
            color="primary"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="form.data.payment"
            :error-messages="form.errors.payment"
            @change="form.validateField('payment')"
            :items="paymentMethods"
            label="Méthode de paiement"
            variant="outlined"
            color="primary"
            class="mb-2"
          >
            <template <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar size="35">
                    <img :src="item.raw.img" width="35" alt="" class="img" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>

            <template <template v-slot:selection="{ item, index }">
              <v-list-item :title="item.title">
                <template v-slot:prepend>
                  <v-avatar size="35">
                    <img :src="item.raw.img" width="35" alt="" class="img" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model="form.data.phone"
            :error-messages="form.errors.phone"
            @change="form.validateField('phone')"
            label="Numero de Télephone"
            type="number"
            prefix="+237"
            variant="outlined"
            color="primary"
            class="mb-7"
            hide-details
          ></v-text-field>
        </form>

        <v-alert
          type="info"
          icon-size="22"
          variant="tonal"
          rounded="md"
          class="border border-info"
          density="compact"
        >
          <p class="text-body-2 mb-0">
            <strong>A savoir:</strong>
            Le numéro que vous entrer la première fois vous devez le réutiliser.
          </p>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog" variant="text"> Annuler </v-btn>
        <v-btn
          @click="processDeposit"
          type="submit"
          :disabled="
            (form.isInValid instanceof Object
              ? form.isInValid.value
              : form.isInValid) ||
            (form.processing instanceof Object
              ? form.processing.value
              : form.processing)
          "
          :loading="loading"
          color="primary"
          variant="flat"
        >
          Déposer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
