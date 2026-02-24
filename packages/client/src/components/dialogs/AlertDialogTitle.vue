<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AlertDialogTitle } from "radix-vue";
import { cn } from "@/lib/utils";

interface AlertDialogTitleProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<AlertDialogTitleProps>();
</script>

<template>
  <AlertDialogTitle
    data-slot="alert-dialog-title"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
