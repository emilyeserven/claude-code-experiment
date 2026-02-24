<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AlertDialogCancel } from "radix-vue";
import { buttonVariants } from "@/components/buttonVariants";
import { cn } from "@/lib/utils";

interface AlertDialogCancelProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<AlertDialogCancelProps>(), {
  variant: "outline",
  size: "default",
});
</script>

<template>
  <AlertDialogCancel
    data-slot="alert-dialog-cancel"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </AlertDialogCancel>
</template>
