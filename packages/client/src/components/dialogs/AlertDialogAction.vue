<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AlertDialogAction } from "radix-vue";
import { buttonVariants } from "@/components/buttonVariants";
import { cn } from "@/lib/utils";

interface AlertDialogActionProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<AlertDialogActionProps>(), {
  variant: "default",
  size: "default",
});
</script>

<template>
  <AlertDialogAction
    data-slot="alert-dialog-action"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </AlertDialogAction>
</template>
