<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    variant?: 'blue';
  }>();

  const buttonClasses = computed(() => {
    const baseClasses =
      'px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
      blue: 'bg-[#3434E0] text-white hover:bg-blue-700 focus:ring-blue-500',
    };

    return `${baseClasses} ${variantClasses[props.variant || 'blue']}`;
  });
</script>

<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>
