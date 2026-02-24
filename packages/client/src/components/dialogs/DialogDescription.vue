<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogDescription } from "radix-vue";
import { cn } from "@/lib/utils";

interface DialogDescriptionProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<DialogDescriptionProps>();
</script>

<template>
  <DialogDescription
    data-slot="dialog-description"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
