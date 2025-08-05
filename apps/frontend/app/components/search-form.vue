<script setup lang="ts">
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import type { Station } from '@mito-test/shared-types';

  /**
   * We can pass default values so the component can be used on pages
   * where for example query params are used to pre-fill the form.
   * */
  const props = defineProps<{
    origin?: string;
    destination?: string;
    departure?: string;
    returnDate?: string;
  }>();

  const { data } = await useFetch<{ data: Station[] }>(
    'http://localhost:4000/api/stations'
  );

  let availableStationsData: Station[] = data.value?.data ?? [];

  const validationSchema = yup.object({
    origin: yup.string().required('Origin is required'),
    destination: yup
      .string()
      .required('Destination is required')
      .test(
        'is-different',
        'Destination has to be different from origin',
        function (value) {
          return value.toLowerCase() !== this.parent.origin.toLowerCase();
        }
      ),
    departure: yup
      .date()
      .transform((_, original) => {
        return typeof original === 'string' ? new Date(original) : original;
      })
      .typeError('Invalid date')
      .required('Date is required')
      .test('is-in-future', 'Date must be in the future', (value) => {
        return value && value > new Date();
      }),
    returnDate: yup
      .date()
      .nullable()
      .transform((_, original) => {
        if (!original || original === '') return null;
        return typeof original === 'string' ? new Date(original) : original;
      })
      .test('is-in-future', 'Date must be in the future', (value) => {
        // Only validate if there is a value
        if (!value) return true;
        return value > new Date();
      })
      .test(
        'is-after-departure',
        'Return must be after departure date',
        function (value) {
          // Skip validation if no return date or no departure date
          if (!value || !this.parent.departure) return true;

          const returnDate = new Date(value);
          const departureDate = new Date(this.parent.departure);
          return departureDate < returnDate;
        }
      ),
  });

  const { handleSubmit } = useForm<{
    origin: string;
    destination: string;
    departure: string;
    returnDate: string;
  }>({
    validationSchema,
    initialValues: {
      origin: props.origin || '',
      destination: props.destination || '',
      departure: props.departure || '',
      returnDate: props.returnDate || '',
    },
  });

  /**
   * TODO
   * Probably there is a better way of retrieving the form values,
   * but I couldn't find the appropriate hook in the documentation.
   */
  const { value: originFormValue, errorMessage: originError } =
    useField<string>('origin');
  const { value: destinationFormValue, errorMessage: destinationError } =
    useField<string>('destination');
  const { value: departureFormValue, errorMessage: departureError } =
    useField('departure');
  const { value: returnDateFormValue, errorMessage: returnDateError } =
    useField('returnDate');

  const availableStationsLoading = ref(true);
  const availableStations = ref<Station[]>(availableStationsData ?? []);

  const selectedOriginStation = ref<Station | null>(null);
  const selectedDestinationStation = ref<Station | null>(null);

  const handleOriginStationSelected = (station: Station) => {
    selectedOriginStation.value = station;
    originFormValue.value = station.shortName;
  };

  const handleDestinationStationSelected = (station: Station) => {
    selectedDestinationStation.value = station;
    destinationFormValue.value = station.shortName;
  };

  const onSubmit = handleSubmit(async (values) => {
    await navigateTo({
      path: '/select-flight',
      query: {
        origin: selectedOriginStation.value?.iata,
        destination: selectedDestinationStation.value?.iata,
        departure: values.departure,
        ...(values.returnDate !== '' ? { returnDate: values.returnDate } : {}),
      },
    });
  });
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="bg-white pb-[20px] rounded-b-[2px]">
      <div
        class="bg-[#06038D] flex items-center p-[15px] gap-[15px] rounded-t-[2px]"
      >
        <img
          src="/mito-airline-logo.svg"
          alt=""
          aria-hidden="true"
          class="w-[28px] h-[28px]"
        />
        <h2 class="text-white uppercase text-[17px] mb-[-3px]">Mito airline</h2>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 p-[25px] md:gap-x-[20px] md:gap-y-[50px]"
      >
        <!-- Origin -->
        <AutocompleteInput
          v-model="originFormValue"
          label="Origin"
          name="origin"
          id="origin"
          :loading="availableStationsLoading"
          :error="originError"
          type="text"
          @itemSelected="handleOriginStationSelected"
          :suggestions="
            availableStations.filter((station) => {
              const orig = originFormValue.toLowerCase();
              return station.shortName.toLowerCase().includes(orig);
            })
          "
        />
        <!-- Destination -->
        <AutocompleteInput
          v-model="destinationFormValue"
          label="Destination"
          name="destination"
          id="destination"
          :loading="availableStationsLoading"
          :error="destinationError"
          type="text"
          @itemSelected="handleDestinationStationSelected"
          :suggestions="
            availableStations.filter((station) => {
              const dest = destinationFormValue.toLowerCase();
              const orig = originFormValue.toLowerCase();
              return (
                station.shortName.toLowerCase().includes(dest) &&
                station.shortName.toLowerCase() !== orig
              );
            })
          "
        />
        <!-- Departure date -->
        <InputField
          v-model="departureFormValue"
          label="Departure"
          id="departure"
          type="date"
          name="departure"
          :error="departureError"
        />
        <!-- Return date -->
        <InputField
          v-model="returnDateFormValue"
          label="Return"
          id="returnDate"
          type="date"
          name="returnDate"
          :error="returnDateError"
        />
      </div>
      <div class="flex justify-center">
        <Button type="submit">Search</Button>
      </div>
    </div>
  </form>
</template>
