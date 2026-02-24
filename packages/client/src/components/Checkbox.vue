<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { CheckboxIndicator, CheckboxRoot } from "radix-vue";
import { CheckIcon } from "lucide-vue-next";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  ariaLabel?: string;
}

const props = defineProps<CheckboxProps>();
const emit = defineEmits<{
  "update:checked": [value: boolean];
}>();
</script>

<template>
  <CheckboxRoot
    data-slot="checkbox"
    :checked="props.checked"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    :class="cn(
      'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary',
      props.class,
    )"
    @update:checked="emit('update:checked', $event)"
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
    >
      <CheckIcon class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
