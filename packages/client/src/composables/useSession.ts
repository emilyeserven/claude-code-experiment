import type { InjectionKey, ComputedRef, Ref } from "vue";

import { computed, inject, provide } from "vue";

import type { TimestampMode } from "./useTimestampSettings";

import { useLocalStorage } from "./useLocalStorage";

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

export interface SessionState {
  sessions: Ref<Session[]>;
  activeSession: ComputedRef<Session>;
  createSession: (name: string) => Session;
  deleteSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  switchSession: (id: string) => void;
  addEntry: (entry: TimerEntry) => void;
  editEntry: (index: number, entry: TimerEntry) => void;
  deleteEntry: (index: number) => void;
  deleteEntries: (indices: number[]) => void;
}

export const SESSION_KEY: InjectionKey<SessionState> = Symbol("Session");

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createDefaultSession(): Session {
  return {
    id: generateId(),
    name: "Default Session",
    entries: [],
  };
}

function migrateFromLegacyStorage(): Session[] | null {
  try {
    const legacyEntries = localStorage.getItem("timer-entries");
    if (legacyEntries !== null) {
      const entries = JSON.parse(legacyEntries) as TimerEntry[];
      localStorage.removeItem("timer-entries");
      if (entries.length > 0) {
        return [{
          id: generateId(),
          name: "Default Session",
          entries,
        }];
      }
    }
  }
  catch {
    // Silently fail on migration errors
  }
  return null;
}

export function useSession(): SessionState {
  const state = inject(SESSION_KEY);
  if (!state) {
    throw new Error("useSession() was called without a provider. Make sure provideSession() is called in a parent component.");
  }
  return state;
}

export function provideSession(): SessionState {
  const [sessions, setSessions] = useLocalStorage<Session[]>("timer-sessions", () => {
    const migrated = migrateFromLegacyStorage();
    if (migrated) return migrated;
    return [createDefaultSession()];
  });

  const [activeSessionId, setActiveSessionId] = useLocalStorage<string>(
    "timer-active-session",
    sessions.value[0]?.id ?? "",
  );

  const activeSession = computed<Session>(
    () => sessions.value.find(s => s.id === activeSessionId.value) ?? sessions.value[0],
  );

  const createSession = (name: string): Session => {
    const newSession: Session = {
      id: generateId(),
      name,
      entries: [],
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  const deleteSession = (id: string): void => {
    setSessions((prev) => {
      const remaining = prev.filter(s => s.id !== id);
      if (remaining.length === 0) {
        const fallback = createDefaultSession();
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      return remaining;
    });
    setActiveSessionId((prevId) => {
      if (prevId === id) {
        const remaining = sessions.value.filter(s => s.id !== id);
        return remaining[0]?.id ?? "";
      }
      return prevId;
    });
  };

  const renameSession = (id: string, name: string): void => {
    setSessions(prev => prev.map(s => s.id === id
      ? {
        ...s,
        name,
      }
      : s));
  };

  const switchSession = (id: string): void => {
    setActiveSessionId(id);
  };

  const addEntry = (entry: TimerEntry): void => {
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId.value
        ? {
          ...s,
          entries: [...s.entries, entry],
        }
        : s));
  };

  const editEntry = (index: number, entry: TimerEntry): void => {
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId.value
        ? {
          ...s,
          entries: s.entries.map((e, i) => i === index ? entry : e),
        }
        : s));
  };

  const deleteEntry = (index: number): void => {
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId.value
        ? {
          ...s,
          entries: s.entries.filter((_, i) => i !== index),
        }
        : s));
  };

  const deleteEntries = (indices: number[]): void => {
    const indexSet = new Set(indices);
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId.value
        ? {
          ...s,
          entries: s.entries.filter((_, i) => !indexSet.has(i)),
        }
        : s));
  };

  const state: SessionState = {
    sessions,
    activeSession,
    createSession,
    deleteSession,
    renameSession,
    switchSession,
    addEntry,
    editEntry,
    deleteEntry,
    deleteEntries,
  };

  provide(SESSION_KEY, state);

  return state;
}
