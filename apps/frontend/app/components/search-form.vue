<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps<{
    origin?: string;
    destination?: string;
    departure?: string;
    returnDate?: string;
  }>();

  const origin = ref(props.origin || '');
  const destination = ref(props.destination || '');
  const departure = ref(props.departure || '');
  const returnDate = ref(props.returnDate || '');
</script>

<template>
  <form>
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
      <div class="grid grid-cols-1 md:grid-cols-2 p-[25px]">
        <!-- Origin -->
        <InputField
          @update:input-value="origin = $event"
          :input-value="origin"
          label="Origin"
          id="origin"
          type="text"
        />
        <!-- Destination -->
        <InputField
          @update:input-value="destination = $event"
          :input-value="destination"
          label="Destination"
          id="destination"
          type="text"
        />
        <!-- Departure date -->
        <InputField
          @update:input-value="departure = $event"
          :input-value="departure"
          label="Departure"
          id="departure"
          type="date"
        />
        <!-- Return date -->
        <InputField
          @update:input-value="returnDate = $event"
          :input-value="returnDate"
          label="Return"
          id="returnDate"
          type="date"
        />
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-[#3434E0] text-white py-[15px] px-[80px] rounded-[3px] text-[18px]"
        >
          Search
        </button>
      </div>
    </div>
  </form>
</template>
