<script setup lang="ts">
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';

  const props = defineProps<{
    origin?: string;
    destination?: string;
    departure?: string;
    returnDate?: string;
  }>();

  const validationSchema = yup.object({
    origin: yup.string().required('Origin is required'),
    destination: yup.string().required('Destination is required'),
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
      .transform((_, original) => {
        return typeof original === 'string' ? new Date(original) : original;
      })
      .typeError('Invalid date')
      .required('Date is required')
      .test('is-in-future', 'Date must be in the future', (value) => {
        return value && value > new Date();
      }),
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

  const { value: originFormValue, errorMessage: originError } =
    useField('origin');
  const { value: destinationFormValue, errorMessage: destinationError } =
    useField('destination');
  const { value: departureFormValue, errorMessage: departureError } =
    useField('departure');
  const { value: returnDateFormValue, errorMessage: returnDateError } =
    useField('returnDate');

  const onSubmit = handleSubmit((values) => {
    console.log(values);
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
        <InputField
          v-model="originFormValue"
          label="Origin"
          id="origin"
          type="text"
          name="origin"
          :error="originError"
        />
        <!-- Destination -->
        <InputField
          v-model="destinationFormValue"
          label="Destination"
          id="destination"
          type="text"
          name="destination"
          :error="destinationError"
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
        <button
          type="submit"
          class="bg-[#3434E0] text-white py-[15px] px-[80px] rounded-[3px] text-[18px] hover:bg-[#3322a0]"
        >
          Search
        </button>
      </div>
    </div>
  </form>
</template>
