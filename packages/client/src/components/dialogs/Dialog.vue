<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot } from "radix-vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

interface DialogProps {
  open?: boolean;
}

const props = defineProps<DialogProps>();
const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <DialogRoot
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <slot name="trigger" />
    <DialogPortal>
      <DialogOverlay
        data-slot="dialog-overlay"
        class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <DialogContent
        data-slot="dialog-content"
        class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg"
      >
        <slot />
        <DialogClose
          class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          data-testid="dialog-close-button"
        >
          <X class="size-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
