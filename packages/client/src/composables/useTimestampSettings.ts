import type { InjectionKey, Ref } from "vue";

import { inject, provide } from "vue";

import { useLocalStorage } from "./useLocalStorage";

export type TimestampMode = "submit" | "typing-start";

export interface TimestampSettingsState {
  timestampMode: Ref<TimestampMode>;
  setTimestampMode: (mode: TimestampMode) => void;
}

export const TIMESTAMP_SETTINGS_KEY: InjectionKey<TimestampSettingsState> = Symbol("TimestampSettings");

export function useTimestampSettings(): TimestampSettingsState {
  const state = inject(TIMESTAMP_SETTINGS_KEY);
  if (!state) {
    throw new Error("useTimestampSettings() was called without a provider. Make sure provideTimestampSettings() is called in a parent component.");
  }
  return state;
}

export function provideTimestampSettings(): TimestampSettingsState {
  const [timestampMode, setTimestampMode] = useLocalStorage<TimestampMode>(
    "timer-timestamp-mode",
    "submit",
  );

  const state: TimestampSettingsState = {
    timestampMode,
    setTimestampMode,
  };

  provide(TIMESTAMP_SETTINGS_KEY, state);

  return state;
}
