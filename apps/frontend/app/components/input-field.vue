<template>
  <div class="relative mb-6 font-sans">
    <label
      :for="id"
      class="absolute left-[15px] pointer-events-none transition-all duration-200 ease-in-out"
      :class="labelClasses"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      class="w-full px-3 py-3 border border-gray-400 rounded-[2px] text-base transition-colors duration-200 ease-in-out box-border focus:outline-none focus:border-blue-500"
      :class="{
        'border-red-500': !!error,
        'pr-10': icon || !!error,
      }"
      :value="modelValue"
      @input="updateValue"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :placeholder="isFocused ? placeholder : ''"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from 'vue';

  interface InputProps {
    modelValue: string;
    label: string;
    placeholder?: string;
    type?: string;
    id?: string;
    error?: string;
    icon?: boolean;
  }

  const { error, modelValue } = withDefaults(defineProps<InputProps>(), {
    modelValue: '',
    placeholder: '',
    type: 'text',
    id: '',
    error: '',
    icon: false,
  });

  const emit = defineEmits(['update:modelValue']);

  const isFocused = ref(false);

  const labelClasses = computed(() => ({
    'top-[2px] text-[10px]': isFocused.value || modelValue,
    'top-1/2 text-base transform -translate-y-1/2':
      !isFocused.value && !modelValue,
    'text-gray-500': !error,
    'text-red-500': !!error,
  }));

  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  };
</script>
