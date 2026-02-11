import type { TimestampMode } from "./TimestampSettingsContext.ts";

import { createSafeContext } from "@/lib/createSafeContext";

export interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: TimestampMode;
}

export interface Session {
  id: string;
  name: string;
  entries: TimerEntry[];
}

export interface SessionProviderState {
  sessions: Session[];
  activeSession: Session;
  createSession: (name: string) => Session;
  deleteSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  switchSession: (id: string) => void;
  addEntry: (entry: TimerEntry) => void;
  editEntry: (index: number, entry: TimerEntry) => void;
  deleteEntry: (index: number) => void;
  deleteEntries: (indices: number[]) => void;
}

export const [SessionProviderContext, useSession] = createSafeContext<SessionProviderState>("Session");
