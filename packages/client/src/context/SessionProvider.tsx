import type { Session, TimerEntry } from "./SessionProviderContext.ts";
import type { ReactNode } from "react";

import { useCallback, useMemo } from "react";

import { SessionProviderContext } from "@/context/SessionProviderContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SessionProviderProps {
  children: ReactNode;
}

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

export function SessionProvider({
  children,
}: SessionProviderProps) {
  const [sessions, setSessions] = useLocalStorage<Session[]>("timer-sessions", () => {
    const migrated = migrateFromLegacyStorage();
    if (migrated) return migrated;
    return [createDefaultSession()];
  });

  const [activeSessionId, setActiveSessionId] = useLocalStorage<string>(
    "timer-active-session",
    sessions[0]?.id ?? "",
  );

  const activeSession = useMemo(
    () => sessions.find(s => s.id === activeSessionId) ?? sessions[0],
    [sessions, activeSessionId],
  );

  const createSession = useCallback((name: string): Session => {
    const newSession: Session = {
      id: generateId(),
      name,
      entries: [],
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, [setSessions, setActiveSessionId]);

  const deleteSession = useCallback((id: string) => {
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
        const remaining = sessions.filter(s => s.id !== id);
        return remaining[0]?.id ?? "";
      }
      return prevId;
    });
  }, [setSessions, setActiveSessionId, sessions]);

  const renameSession = useCallback((id: string, name: string) => {
    setSessions(prev => prev.map(s => s.id === id
      ? {
        ...s,
        name,
      }
      : s));
  }, [setSessions]);

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, [setActiveSessionId]);

  const addEntry = useCallback((entry: TimerEntry) => {
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? {
          ...s,
          entries: [...s.entries, entry],
        }
        : s));
  }, [setSessions, activeSessionId]);

  const deleteEntry = useCallback((index: number) => {
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? {
          ...s,
          entries: s.entries.filter((_, i) => i !== index),
        }
        : s));
  }, [setSessions, activeSessionId]);

  const deleteEntries = useCallback((indices: number[]) => {
    const indexSet = new Set(indices);
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? {
          ...s,
          entries: s.entries.filter((_, i) => !indexSet.has(i)),
        }
        : s));
  }, [setSessions, activeSessionId]);

  const value = useMemo(() => ({
    sessions,
    activeSession,
    createSession,
    deleteSession,
    renameSession,
    switchSession,
    addEntry,
    deleteEntry,
    deleteEntries,
  }), [sessions, activeSession, createSession, deleteSession, renameSession, switchSession, addEntry, deleteEntry, deleteEntries]);

  return (
    <SessionProviderContext.Provider value={value}>
      {children}
    </SessionProviderContext.Provider>
  );
}
