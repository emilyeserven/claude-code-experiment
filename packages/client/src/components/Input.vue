<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";

interface InputProps {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  class?: HTMLAttributes["class"];
  autofocus?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  keydown: [event: KeyboardEvent];
}>();
</script>

<template>
  <input
    :id="props.id"
    :type="props.type"
    data-slot="input"
    :class="cn(
      'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      props.class,
    )"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :autofocus="props.autofocus"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @keydown="emit('keydown', $event)"
  >
</template>
