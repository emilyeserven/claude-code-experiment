import { useCallback, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { SessionName } from "@/components/SessionName";
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
  const [showDeleteSessionDialog, setShowDeleteSessionDialog] = useState(false);
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
    setShowDeleteSessionDialog(false);
  }, [deleteSession, activeSession.id]);

  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <div className="mt-8 flex flex-col items-center gap-8">
        <SessionName
          name={activeSession.name}
          onRename={handleRename}
        />
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
        <div className="mb-8">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteSessionDialog(true)}
            data-testid="delete-session-button"
          >
            <Trash2 className="size-4" />
            Delete Session
          </Button>
        </div>
      </div>

      <AlertDialog
        open={showDeleteSessionDialog}
        onOpenChange={setShowDeleteSessionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {activeSession.name}
              &quot;? All entries in this session will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-session">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSession}
              data-testid="confirm-delete-session"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
