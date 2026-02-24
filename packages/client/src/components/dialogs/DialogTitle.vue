<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogTitle } from "radix-vue";
import { cn } from "@/lib/utils";

interface DialogTitleProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<DialogTitleProps>();
</script>

<template>
  <DialogTitle
    data-slot="dialog-title"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
