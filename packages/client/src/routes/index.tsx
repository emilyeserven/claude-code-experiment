import { useCallback, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Timer } from "@/components/Timer";
import { TimerEntriesTable } from "@/components/TimerEntriesTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatTime } from "@/utils/formatTime";

interface TimerEntry {
  text: string;
  timestamp: string;
}

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const [inputValue, setInputValue] = useState("");
  const [entries, setEntries] = useLocalStorage<TimerEntry[]>("timer-entries", []);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const elapsedMsRef = useRef(0);

  const handleTick = useCallback((elapsedMs: number) => {
    elapsedMsRef.current = elapsedMs;
  }, []);

  const handleRunningChange = useCallback((running: boolean) => {
    setIsTimerRunning(running);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    setEntries(prev => [...prev, {
      text: inputValue.trim(),
      timestamp: formatTime(elapsedMsRef.current),
    }]);
    setInputValue("");
  }, [inputValue, setEntries]);

  const handleDeleteEntry = useCallback((index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  }, [setEntries]);

  const handleDeleteEntries = useCallback((indices: number[]) => {
    const indexSet = new Set(indices);
    setEntries(prev => prev.filter((_, i) => !indexSet.has(i)));
  }, [setEntries]);

  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <div className="mt-8 flex flex-col items-center gap-8">
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
                    onChange={e => setInputValue(e.target.value)}
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
        </div>
        <div className="mt-4 flex w-full justify-center">
          <TimerEntriesTable
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
            onDeleteEntries={handleDeleteEntries}
          />
        </div>
      </div>
    </div>
  );
}
