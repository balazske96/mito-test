<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'blue';
  }>();

  const variant = computed(() => props.variant ?? 'blue');
</script>

<template>
  <button :type="type ?? 'button'" class="base" :class="variant">
    <slot />
  </button>
</template>

<style scoped>
  .base {
    @apply uppercase rounded-[3px] py-[15px] px-[80px] text-[18px];
  }

  .blue {
    @apply bg-[#3434E0] text-white hover:bg-[#3322a0] focus:ring-blue-500;
  }
</style>
