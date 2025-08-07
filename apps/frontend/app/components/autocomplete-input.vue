<script setup lang="ts">
  /**
   * TODO
   * Refactor the overall structure and logic of the component.
   */

  import type { Station } from '@mito-test/shared-types';
  import { ref } from 'vue';

  const model = defineModel<string>();

  defineProps<{
    label: string;
    id: string;
    name: string;
    error?: string;
    suggestions: Station[];
    loading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'itemSelected', item: Station): void;
  }>();

  // Add a ref to track input focus state
  const isFocused = ref(false);

  function selectItem(item: Station) {
    emit('itemSelected', item);
  }

  // Functions to handle focus events
  function handleFocus() {
    isFocused.value = true;
  }

  function handleBlur() {
    // Delay hiding the suggestions to allow click events to register
    setTimeout(() => {
      isFocused.value = false;
    }, 150);
  }
</script>

<template>
  <div class="relative">
    <InputField
      v-model="model"
      :label="label"
      :id="id"
      :type="'text'"
      :name="name"
      :error="error"
      autocomplete="off"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div
      v-if="loading && isFocused"
      class="absolute w-full bg-white border border-gray-300 rounded-b-md shadow-lg p-2 z-10"
    >
      Loading...
    </div>
    <ul
      v-if="suggestions.length > 0 && isFocused"
      class="absolute w-full max-h-[30vh] overflow-y-scroll bg-white border border-gray-300 rounded-b-md shadow-lg z-10"
    >
      <li
        v-for="station in suggestions"
        :key="station.iata"
        @click="selectItem(station)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ station.shortName }}
      </li>
    </ul>
  </div>
</template>
