<script setup lang="ts">
import { ref, computed } from "vue";

import SessionName from "@/components/SessionName.vue";
import SessionSettingsMenu from "@/components/SessionSettingsMenu.vue";
import Timer from "@/components/Timer.vue";
import TimerEntriesTable from "@/components/TimerEntriesTable.vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Tooltip from "@/components/Tooltip.vue";
import TooltipTrigger from "@/components/TooltipTrigger.vue";
import TooltipContent from "@/components/TooltipContent.vue";
import { useSession, useTimestampSettings } from "@/composables";
import { formatTime } from "@/utils/formatTime";

const inputValue = ref("");
const isTimerRunning = ref(false);
const typingStartMs = ref<number | null>(null);
let elapsedMs = 0;

const { timestampMode } = useTimestampSettings();
const {
  activeSession,
  renameSession,
  deleteSession,
  addEntry,
  editEntry,
  deleteEntry,
  deleteEntries,
} = useSession();

function handleTick(ms: number) {
  elapsedMs = ms;
}

function handleRunningChange(running: boolean) {
  isTimerRunning.value = running;
}

function handleInputChange(value: string) {
  if (inputValue.value === "" && value !== "" && timestampMode.value === "typing-start") {
    typingStartMs.value = elapsedMs;
  }
  inputValue.value = value;
}

function handleSubmit() {
  if (!inputValue.value.trim()) return;
  const timestampMs = timestampMode.value === "typing-start" && typingStartMs.value !== null
    ? typingStartMs.value
    : elapsedMs;
  addEntry({
    text: inputValue.value.trim(),
    timestamp: formatTime(timestampMs),
    mode: timestampMode.value,
  });
  inputValue.value = "";
  typingStartMs.value = null;
}

function handleRename(name: string) {
  renameSession(activeSession.value.id, name);
}

function handleDeleteSession() {
  deleteSession(activeSession.value.id);
}

const typingStartTimestamp = computed(() => {
  if (timestampMode.value === "typing-start" && typingStartMs.value !== null) {
    return formatTime(typingStartMs.value);
  }
  return null;
});
</script>

<template>
  <div class="bg-white p-2 text-black dark:bg-gray-800 dark:text-white">
    <div class="mt-8 flex flex-col items-center gap-8">
      <div class="flex items-center gap-1">
        <SessionName
          :name="activeSession.name"
          @rename="handleRename"
        />
        <SessionSettingsMenu
          :session-name="activeSession.name"
          :entries="activeSession.entries"
          @delete-session="handleDeleteSession"
        />
      </div>
      <Timer
        @tick="handleTick"
        @running-change="handleRunningChange"
      />
      <div class="flex w-full max-w-md flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger>
            <div class="flex w-full gap-2">
              <Input
                :model-value="inputValue"
                placeholder="Enter text..."
                data-testid="timer-input"
                @update:model-value="handleInputChange"
                @keydown="$event.key === 'Enter' && handleSubmit()"
              />
              <Button
                data-testid="timer-submit-button"
                @click="handleSubmit"
              >
                Submit
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            v-if="!isTimerRunning"
            class="hidden md:block"
            :side-offset="8"
          >
            Start the timer before adding notes
          </TooltipContent>
        </Tooltip>
        <p
          v-if="!isTimerRunning"
          class="text-sm text-muted-foreground md:hidden"
          data-testid="timer-warning-text"
        >
          Start the timer before adding notes
        </p>
        <p
          v-if="typingStartTimestamp"
          class="text-sm text-muted-foreground"
          data-testid="typing-start-timestamp"
        >
          Timestamp: {{ typingStartTimestamp }}
        </p>
      </div>
      <div class="mt-4 flex w-full justify-center">
        <TimerEntriesTable
          :entries="activeSession.entries"
          @edit-entry="editEntry"
          @delete-entry="deleteEntry"
          @delete-entries="deleteEntries"
        />
      </div>
    </div>
  </div>
</template>
