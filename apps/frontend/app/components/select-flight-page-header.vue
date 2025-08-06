<script setup lang="ts">
  import type { Station } from '@mito-test/shared-types';

  interface Props {
    origin: Station;
    destination: Station;
  }

  const { origin, destination } = defineProps<Props>();
</script>

<template>
  <div
    class="flex lg:justify-center px-8 items-center py-4 backdrop-blur-md my-6 shadow-lg rounded"
  >
    <div class="absolute right-8 lg:left-8">
      <NuxtLink class="text-[#3434E0] underline" to="/">Home</NuxtLink>
    </div>
    <div class="flex gap-4 items-center">
      <WizzAirPlane />
      <div
        class="flex flex-col gap-2 items-start md:items-center md:gap-4 md:flex-row"
      >
        <span class="md:text-2xl">
          <b class="text-[#3434E0]">{{ origin.shortName }}</b>
          {{ origin.iata }}
        </span>
        <FlightArrow />
        <span class="md:text-2xl">
          <b class="text-[#3434E0]">{{ destination.shortName }}</b>
          {{ destination.iata }}
        </span>
      </div>
    </div>
  </div>
</template>
