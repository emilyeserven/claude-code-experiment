<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import Button from "@/components/Button.vue";
import { formatTime } from "@/utils/formatTime";

const emit = defineEmits<{
  tick: [elapsedMs: number];
  runningChange: [isRunning: boolean];
}>();

const elapsedMs = ref(0);
const isRunning = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;
let startTime = 0;

function start() {
  if (isRunning.value) return;
  isRunning.value = true;
  emit("runningChange", true);
  startTime = Date.now() - elapsedMs.value;
  intervalId = setInterval(() => {
    const newElapsed = Date.now() - startTime;
    elapsedMs.value = newElapsed;
    emit("tick", newElapsed);
  }, 10);
}

function stop() {
  if (!isRunning.value) return;
  isRunning.value = false;
  emit("runningChange", false);
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function reset() {
  isRunning.value = false;
  emit("runningChange", false);
  elapsedMs.value = 0;
  emit("tick", 0);
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<template>
  <div
    class="flex flex-col items-center gap-6"
    data-testid="timer-component-root"
  >
    <div
      class="font-mono text-5xl font-bold tracking-tight tabular-nums"
      data-testid="timer-display"
    >
      {{ formatTime(elapsedMs) }}
    </div>
    <div class="flex gap-3">
      <Button
        v-if="!isRunning"
        data-testid="timer-start-button"
        @click="start"
      >
        Start Timer
      </Button>
      <Button
        v-if="isRunning"
        data-testid="timer-stop-button"
        @click="stop"
      >
        Stop Timer
      </Button>
      <Button
        v-if="elapsedMs > 0"
        variant="destructive"
        data-testid="timer-reset-button"
        @click="reset"
      >
        Reset Timer
      </Button>
    </div>
  </div>
</template>
