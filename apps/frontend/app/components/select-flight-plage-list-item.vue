<script setup lang="ts">
  import Button from '~/components/button.vue';
  import type { Flight } from '@mito-test/shared-types';
  import LongArrow from '~/components/long-arrow.vue';
  import { computed } from 'vue';
  import { formatDate, formatFlightTime } from '~/utils/date-formatter';
  import { formatCurrency } from '~/utils/currency-formatter';

  const { flight } = defineProps<{ flight: Flight }>();

  const classDisplayDictionary = {
    basic: 'Basic',
    standard: 'Standard',
    plus: 'Plus+',
  };

  const flightTime =
    +new Date(flight.arrivalDateTime) - +new Date(flight.departureDateTime);

  const formattedFlightTime = computed(() => {
    return formatFlightTime(flightTime);
  });

  const formattedDepartureDate = computed(() => {
    return formatDate(new Date(flight.departureDateTime));
  });

  const formattedArrivalDate = computed(() => {
    return formatDate(new Date(flight.arrivalDateTime));
  });

  const formatPrice = (amount: number, currencyCode: string) => {
    return formatCurrency(amount, currencyCode);
  };

  function addToCart() {
    /**
     * TODO
     * Handle adding the flight to the cart.
     */
    alert('Ticket added to cart');
  }
</script>

<template>
  <div class="py-4 bg-white shadow-lg py-8 mt-4 rounded">
    <div class="flex items-center justify-center gap-4 text-gray-500">
      <span class="text-sm text-gray-500">
        {{ formattedDepartureDate }} - {{ formattedArrivalDate }}
      </span>
    </div>
    <div class="flex items-center justify-center gap-2 lg:gap-8 py-4 px-4">
      <span>{{ flight.departureStation }}</span>
      <div class="relative">
        <LongArrow />
        <span class="absolute left-[50%] -translate-x-1/2 bg-white px-2">
          {{ formattedFlightTime }}
        </span>
      </div>
      <span>{{ flight.arrivalStation }}</span>
    </div>
    <div class="flex flex-col lg:flex-row justify-center gap-4 mt-4 lg:mt-8">
      <div class="flex flex-col items-center" v-for="fare in flight.fares">
        <span>{{ classDisplayDictionary[fare.bundle] }}</span>
        <span class="text-lg">
          {{ formatPrice(fare.price.amount, fare.price.currencyCode) }}
        </span>
        <!-- Just realized that some native attributes are passed -->
        <Button @click="addToCart" class="custom-button-size">
          Add to cart
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .custom-button-size {
    @apply px-[35px] py-[13px] text-[14px];
    @apply sm:px-[50px] sm:py-[15px] sm:text-[16px];
    @apply md:px-[80px] md:py-[15px] md:text-[18px];
  }
</style>
