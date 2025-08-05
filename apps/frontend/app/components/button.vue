<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    type: 'button' | 'submit' | 'reset';
    variant?: 'blue';
  }>();

  const buttonClasses = computed(() => {
    const baseClasses =
      'py-[15px] px-[80px] rounded-[3px] text-[18px] uppercase';

    const variantClasses = {
      blue: 'bg-[#3434E0] text-white hover:bg-[#3322a0] focus:ring-blue-500',
    };

    return `${baseClasses} ${variantClasses[props.variant || 'blue']}`;
  });
</script>

<template>
  <button :type="type ?? 'button'" :class="buttonClasses">
    <slot />
  </button>
</template>
