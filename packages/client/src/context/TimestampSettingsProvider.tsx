import type { TimestampMode } from "./TimestampSettingsContext.ts";
import type { ReactNode } from "react";

import { TimestampSettingsContext } from "@/context/TimestampSettingsContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface TimestampSettingsProviderProps {
  children: ReactNode;
}

export function TimestampSettingsProvider({
  children,
}: TimestampSettingsProviderProps) {
  const [timestampMode, setTimestampMode] = useLocalStorage<TimestampMode>(
    "timer-timestamp-mode",
    "submit",
  );

  return (
    <TimestampSettingsContext.Provider
      value={{
        timestampMode,
        setTimestampMode,
      }}
    >
      {children}
    </TimestampSettingsContext.Provider>
  );
}
