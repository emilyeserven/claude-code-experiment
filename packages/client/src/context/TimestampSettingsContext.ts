import { createSafeContext } from "@/lib/createSafeContext";

export type TimestampMode = "submit" | "typing-start";

export interface TimestampSettingsState {
  timestampMode: TimestampMode;
  setTimestampMode: (mode: TimestampMode) => void;
}

export const [TimestampSettingsContext, useTimestampSettings] = createSafeContext<TimestampSettingsState>("TimestampSettings");
