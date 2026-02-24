<script setup lang="ts">
import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "vue";

import { buttonVariants } from "@/components/buttonVariants";
import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "default",
  size: "default",
  type: "button",
});
</script>

<template>
  <button
    :type="props.type"
    data-slot="button"
    :data-variant="props.variant"
    :data-size="props.size"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>
