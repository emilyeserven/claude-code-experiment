<script setup lang="ts">
import { AlertDialogContent, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot } from "radix-vue";

interface AlertDialogProps {
  open?: boolean;
}

const props = defineProps<AlertDialogProps>();
const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <AlertDialogRoot
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <slot name="trigger" />
    <AlertDialogPortal>
      <AlertDialogOverlay
        data-slot="alert-dialog-overlay"
        class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <AlertDialogContent
        data-slot="alert-dialog-content"
        class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg"
      >
        <slot />
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
