import { createContext } from "react";

export interface TimerEntry {
  text: string;
  timestamp: string;
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

const defaultSession: Session = {
  id: "default",
  name: "Default Session",
  entries: [],
};

const initialState: SessionProviderState = {
  sessions: [defaultSession],
  activeSession: defaultSession,
  createSession: () => defaultSession,
  deleteSession: () => null,
  renameSession: () => null,
  switchSession: () => null,
  addEntry: () => null,
  editEntry: () => null,
  deleteEntry: () => null,
  deleteEntries: () => null,
};

export const SessionProviderContext = createContext<SessionProviderState>(initialState);
