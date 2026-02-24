<script setup lang="ts">
import { ref, computed } from "vue";
import { Check, ClipboardCopy } from "lucide-vue-next";
import Button from "@/components/Button.vue";
import Dialog from "@/components/dialogs/Dialog.vue";
import DialogHeader from "@/components/dialogs/DialogHeader.vue";
import DialogFooter from "@/components/dialogs/DialogFooter.vue";
import DialogTitle from "@/components/dialogs/DialogTitle.vue";
import DialogDescription from "@/components/dialogs/DialogDescription.vue";

interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: "submit" | "typing-start";
}

const props = defineProps<{
  open: boolean;
  entries: TimerEntry[];
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const copied = ref(false);

function formatMode(mode?: "submit" | "typing-start"): string {
  if (mode === "typing-start") return "Typing Start";
  if (mode === "submit") return "Submit";
  return "";
}

const markdown = computed(() => {
  if (props.entries.length === 0) return "";
  const hasMode = props.entries.some(entry => entry.mode !== undefined);
  if (hasMode) {
    const header = "| Text | Timestamp | Mode |";
    const separator = "| --- | --- | --- |";
    const rows = props.entries.map(entry => `| ${entry.text} | ${entry.timestamp} | ${formatMode(entry.mode)} |`);
    return [header, separator, ...rows].join("\n");
  }
  const header = "| Text | Timestamp |";
  const separator = "| --- | --- |";
  const rows = props.entries.map(entry => `| ${entry.text} | ${entry.timestamp} |`);
  return [header, separator, ...rows].join("\n");
});

async function handleCopy() {
  await navigator.clipboard.writeText(markdown.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function handleOpenChange(value: boolean) {
  emit("update:open", value);
  if (!value) {
    copied.value = false;
  }
}
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="handleOpenChange"
  >
    <DialogHeader>
      <DialogTitle data-testid="export-markdown-title">
        Export as Markdown
      </DialogTitle>
      <DialogDescription data-testid="export-markdown-description">
        Copy the markdown below to use your entries elsewhere.
      </DialogDescription>
    </DialogHeader>
    <textarea
      readonly
      :value="markdown"
      class="h-48 w-full resize-none rounded-md border bg-muted px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-ring focus:outline-none"
      data-testid="markdown-export-textarea"
    />
    <DialogFooter>
      <Button
        data-testid="copy-markdown-button"
        @click="handleCopy"
      >
        <Check
          v-if="copied"
          class="size-4"
        />
        <ClipboardCopy
          v-else
          class="size-4"
        />
        {{ copied ? "Copied!" : "Copy to Clipboard" }}
      </Button>
    </DialogFooter>
  </Dialog>
</template>
