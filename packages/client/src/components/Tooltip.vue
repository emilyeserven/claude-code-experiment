<script setup lang="ts">
import { TooltipProvider, TooltipRoot } from "radix-vue";

interface TooltipProps {
  delayDuration?: number;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  delayDuration: 0,
});
</script>

<template>
  <TooltipProvider :delay-duration="props.delayDuration">
    <TooltipRoot>
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
