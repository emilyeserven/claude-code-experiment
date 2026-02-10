import { useCallback, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { SessionName } from "@/components/SessionName";
import { SessionSettingsMenu } from "@/components/SessionSettingsMenu";
import { Timer } from "@/components/Timer";
import { TimerEntriesTable } from "@/components/TimerEntriesTable";
import { Button, Input, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import { useSession, useTimestampSettings } from "@/hooks";
import { formatTime } from "@/utils/formatTime";

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const [inputValue, setInputValue] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [typingStartMs, setTypingStartMs] = useState<number | null>(null);
  const elapsedMsRef = useRef(0);
  const {
    timestampMode,
  } = useTimestampSettings();

  const {
    activeSession,
    renameSession,
    deleteSession,
    addEntry,
    editEntry,
    deleteEntry,
    deleteEntries,
  } = useSession();

  const handleTick = useCallback((elapsedMs: number) => {
    elapsedMsRef.current = elapsedMs;
  }, []);

  const handleRunningChange = useCallback((running: boolean) => {
    setIsTimerRunning(running);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    if (inputValue === "" && value !== "" && timestampMode === "typing-start") {
      setTypingStartMs(elapsedMsRef.current);
    }
    setInputValue(value);
  }, [inputValue, timestampMode]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    const timestampMs = timestampMode === "typing-start" && typingStartMs !== null
      ? typingStartMs
      : elapsedMsRef.current;
    addEntry({
      text: inputValue.trim(),
      timestamp: formatTime(timestampMs),
      mode: timestampMode,
    });
    setInputValue("");
    setTypingStartMs(null);
  }, [inputValue, addEntry, timestampMode, typingStartMs]);

  const handleEditEntry = useCallback((index: number, entry: { text: string;
    timestamp: string; }) => {
    editEntry(index, entry);
  }, [editEntry]);

  const handleDeleteEntry = useCallback((index: number) => {
    deleteEntry(index);
  }, [deleteEntry]);

  const handleDeleteEntries = useCallback((indices: number[]) => {
    deleteEntries(indices);
  }, [deleteEntries]);

  const handleRename = useCallback((name: string) => {
    renameSession(activeSession.id, name);
  }, [renameSession, activeSession.id]);

  const handleDeleteSession = useCallback(() => {
    deleteSession(activeSession.id);
  }, [deleteSession, activeSession.id]);

  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <div className="mt-8 flex flex-col items-center gap-8">
        <div className="flex items-center gap-1">
          <SessionName
            name={activeSession.name}
            onRename={handleRename}
          />
          <SessionSettingsMenu
            sessionName={activeSession.name}
            entries={activeSession.entries}
            onDeleteSession={handleDeleteSession}
          />
        </div>
        <Timer
          onTick={handleTick}
          onRunningChange={handleRunningChange}
        />
        <div className="flex w-full max-w-md flex-col items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full gap-2">
                  <Input
                    value={inputValue}
                    onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="Enter text..."
                    data-testid="timer-input"
                  />
                  <Button
                    onClick={handleSubmit}
                    data-testid="timer-submit-button"
                  >
                    Submit
                  </Button>
                </div>
              </TooltipTrigger>
              {!isTimerRunning && (
                <TooltipContent
                  className={`
                    hidden
                    md:block
                  `}
                  sideOffset={8}
                >
                  Start the timer before adding notes
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {!isTimerRunning && (
            <p
              className={`
                text-sm text-muted-foreground
                md:hidden
              `}
              data-testid="timer-warning-text"
            >
              Start the timer before adding notes
            </p>
          )}
          {timestampMode === "typing-start" && typingStartMs !== null && (
            <p
              className="text-sm text-muted-foreground"
              data-testid="typing-start-timestamp"
            >
              Timestamp: {formatTime(typingStartMs)}
            </p>
          )}
        </div>
        <div className="mt-4 flex w-full justify-center">
          <TimerEntriesTable
            entries={activeSession.entries}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onDeleteEntries={handleDeleteEntries}
          />
        </div>
      </div>
    </div>
  );
}
