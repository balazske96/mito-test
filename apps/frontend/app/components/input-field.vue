<script setup lang="ts">
  import { ref } from 'vue';

  interface InputProps {
    inputValue: string;
    label: string;
    type?: string;
    id?: string;
    error?: string;
    name?: string;
  }

  const {
    inputValue = '',
    type = 'text',
    id = '',
    error = '',
    name = '',
  } = defineProps<InputProps>();

  const emit = defineEmits(['update:inputValue', 'focus', 'blur']);

  const isFocused = ref(false);

  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:inputValue', target.value);
  };

  const handleFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
  };

  const handleBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
  };
</script>

<template>
  <div>
    <div class="relative mb-[18px] font-sans">
      <label
        :for="id"
        class="absolute left-[15px] pointer-events-none transition-all duration-200 ease-in-out"
        :class="{
          'top-[2px] text-[10px]': isFocused || inputValue,
          'top-1/2 text-base transform -translate-y-1/2':
            !isFocused && !inputValue,
          'text-gray-500': !error,
          'text-mito': !!error,
        }"
      >
        {{ label }}
      </label>
      <input
        :id="id"
        :type="type"
        class="hidden-date-placeholder w-full px-3 py-3 border border-gray-400 rounded-[2px] text-base transition-colors duration-200 ease-in-out box-border focus:outline-none focus:border-blue-500"
        :class="{
          'border-mito border-2 bg-mito bg-opacity-5 shadow-[0_0_5px_5px_rgba(198,0,126,0.05)] focus:border-mito':
            !!error,
        }"
        :value="inputValue"
        @input="updateValue"
        @focus="handleFocus"
        @blur="handleBlur"
        :name="name"
      />
      <div>
        <slot />
      </div>
    </div>
    <div v-if="error" class="flex gap-[9px] items-center">
      <svg
        aria-hidden="true"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9426 17.0101L8.77746 0.646974C8.68141 0.451009 8.3452 0.451009 8.22512 0.646974L0.0360224 17.0591C-0.0120075 17.1571 -0.0120075 17.2795 0.0360224 17.353C0.0840523 17.451 0.180112 17.5 0.300187 17.5H16.6784C16.8465 17.5 16.9906 17.353 16.9906 17.1816C17.0146 17.1326 16.9906 17.0591 16.9426 17.0101ZM8.20111 12.062V5.69308C8.20111 5.52161 8.39323 5.37464 8.56133 5.37464C8.72943 5.37464 8.92155 5.52161 8.92155 5.69308V12.062C8.92155 12.2334 8.72943 12.3804 8.56133 12.3804C8.39323 12.3804 8.20111 12.2334 8.20111 12.062ZM9.44988 14.389C9.44988 14.9035 9.04163 15.3199 8.53732 15.3199C8.033 15.3199 7.62475 14.9035 7.62475 14.389C7.62475 13.8746 8.033 13.4582 8.53732 13.4582C9.04163 13.4582 9.44988 13.8746 9.44988 14.389Z"
          fill="#C6007E"
        />
      </svg>
      <span class="text-mito text-[13px]">{{ error }}</span>
    </div>
  </div>
</template>
