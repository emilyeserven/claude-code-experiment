import { createContext } from "react";

export type TimestampMode = "submit" | "typing-start";

interface TimestampSettingsState {
  timestampMode: TimestampMode;
  setTimestampMode: (mode: TimestampMode) => void;
}

const initialState: TimestampSettingsState = {
  timestampMode: "submit",
  setTimestampMode: () => null,
};

export const TimestampSettingsContext = createContext<TimestampSettingsState>(initialState);
