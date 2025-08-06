<template>
  <div class="px-4">
    <SelectFlightPageHeader
      :origin="originAirport"
      :destination="destinationAirport"
    />
    <SelectFlightPageFlightsError v-if="flightsError" />
    <ul v-if="!flightsError && flights">
      <li v-for="flight in flights || []">
        <SelectFlightPlageListItem :flight="flight" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { Flight, ApiResponse, Station } from '@mito-test/shared-types';
  import SelectFlightPageHeader from '~/components/select-flight-page-header.vue';
  import SelectFlightPlageListItem from '~/components/select-flight-plage-list-item.vue';

  // Get query parameters
  const route = useRoute();
  const origin = route.query.origin ?? '';
  const destination = route.query.destination ?? '';
  const departure = route.query.departure ?? '';
  const returnDate = route.query.returnDate ?? '';

  const config = useRuntimeConfig();

  const { data: flightsData, error: flightsError } = await useFetch<
    ApiResponse<Flight[]>
  >(`${config.public.apiBase}/api/flights/route/${origin}/${destination}`, {
    query: {
      departureDate: departure,
      ...(returnDate ? { returnDate } : {}),
    },
    server: true, // Ensure SSR
  });

  const [originAirport, destinationAirport] = await Promise.all([
    /** TODO handle request error */
    useFetch<ApiResponse<Station>>(
      `${config.public.apiBase}/api/stations/${origin}`
    ).then((response) => response.data.value?.data!),

    useFetch<ApiResponse<Station>>(
      `${config.public.apiBase}/api/stations/${destination}`
    ).then((response) => response.data.value?.data!),
  ]);

  // Handle potential errors
  const flights = computed(() => flightsData.value?.data || []);
</script>
