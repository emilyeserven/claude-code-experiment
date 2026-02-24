<script setup lang="ts">
import { ref } from "vue";

import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";

interface CaptureEntry {
  directions: string;
  prompt: string;
  capturedAt: string;
}

const STORAGE_KEY = "capture-entries";

function loadEntries(): CaptureEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CaptureEntry[];
    }
  }
  catch {
    // ignore parse errors
  }
  return [];
}

function saveEntries(data: CaptureEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const directions = ref("");
const prompt = ref("");
const entries = ref<CaptureEntry[]>(loadEntries());

function handleSubmit() {
  if (!directions.value.trim() && !prompt.value.trim()) return;
  const entry: CaptureEntry = {
    directions: directions.value.trim(),
    prompt: prompt.value.trim(),
    capturedAt: new Date().toISOString(),
  };
  entries.value = [...entries.value, entry];
  saveEntries(entries.value);
  directions.value = "";
  prompt.value = "";
}

function handleClearAll() {
  entries.value = [];
  saveEntries([]);
}

function handleExport() {
  const text = entries.value
    .map(
      (e, i) =>
        `--- Entry ${String(i + 1)} (${e.capturedAt}) ---\nDirections:\n${e.directions}\n\nPrompt:\n${e.prompt}`,
    )
    .join("\n\n");
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="p-4">
    <h2 data-testid="capture-heading">
      Capture
    </h2>
    <p
      class="mb-4 text-sm text-muted-foreground"
      data-testid="capture-description"
    >
      Record the current state of your AI directions and prompts for later
      analysis.
    </p>

    <div class="flex max-w-lg flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label
          class="text-sm font-medium"
          for="directions-input"
        >
          AI Directions
        </label>
        <textarea
          id="directions-input"
          v-model="directions"
          placeholder="Paste or type your current AI directions..."
          rows="4"
          class="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          data-testid="directions-input"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label
          class="text-sm font-medium"
          for="prompt-input"
        >
          Prompt
        </label>
        <Input
          id="prompt-input"
          v-model="prompt"
          placeholder="Enter the prompt you used..."
          data-testid="prompt-input"
          @keydown="$event.key === 'Enter' && handleSubmit()"
        />
      </div>

      <Button
        data-testid="capture-submit"
        @click="handleSubmit"
      >
        Save Entry
      </Button>
    </div>

    <div
      v-if="entries.length > 0"
      class="mt-8"
      data-testid="entries-section"
    >
      <div class="mb-2 flex items-center gap-2">
        <h3 class="text-lg font-medium">
          Saved Entries ({{ entries.length }})
        </h3>
        <Button
          variant="outline"
          size="sm"
          data-testid="export-button"
          @click="handleExport"
        >
          Copy All
        </Button>
        <Button
          variant="destructive"
          size="sm"
          data-testid="clear-all-button"
          @click="handleClearAll"
        >
          Clear All
        </Button>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="(entry, index) in entries"
          :key="entry.capturedAt"
          class="rounded-md border p-3"
          :data-testid="`entry-${index}`"
        >
          <p class="mb-1 text-xs text-muted-foreground">
            {{ new Date(entry.capturedAt).toLocaleString() }}
          </p>
          <div
            v-if="entry.directions"
            class="mb-2"
          >
            <p class="text-sm font-medium">
              Directions:
            </p>
            <p
              class="text-sm whitespace-pre-wrap"
              :data-testid="`entry-${index}-directions`"
            >
              {{ entry.directions }}
            </p>
          </div>
          <div v-if="entry.prompt">
            <p class="text-sm font-medium">
              Prompt:
            </p>
            <p
              class="text-sm"
              :data-testid="`entry-${index}-prompt`"
            >
              {{ entry.prompt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
