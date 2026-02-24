<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { TooltipArrow, TooltipContent, TooltipPortal } from "radix-vue";

import { cn } from "@/lib/utils";

interface TooltipContentProps {
  sideOffset?: number;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<TooltipContentProps>(), {
  sideOffset: 0,
});
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      :side-offset="props.sideOffset"
      :class="cn(
        'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        props.class,
      )"
    >
      <slot />
      <TooltipArrow
        class="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground"
      />
    </TooltipContent>
  </TooltipPortal>
</template>
