<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface AlertDialogHeaderProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<AlertDialogHeaderProps>();
</script>

<template>
  <div
    data-slot="alert-dialog-header"
    :class="cn('grid gap-1.5 text-center sm:text-left', props.class)"
  >
    <slot />
  </div>
</template>
