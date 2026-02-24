<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AlertDialogDescription } from "radix-vue";
import { cn } from "@/lib/utils";

interface AlertDialogDescriptionProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<AlertDialogDescriptionProps>();
</script>

<template>
  <AlertDialogDescription
    data-slot="alert-dialog-description"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
