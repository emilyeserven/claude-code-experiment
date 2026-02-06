import { useContext } from "react";

import { TimestampSettingsContext } from "@/context/TimestampSettingsContext.ts";

export const useTimestampSettings = () => {
  const context = useContext(TimestampSettingsContext);

  if (context === undefined) {
    throw new Error("useTimestampSettings must be used within TimestampSettingsProvider");
  }
  return context;
};
