import { useCallback, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Timer } from "@/components/Timer";
import { TimerEntriesTable } from "@/components/TimerEntriesTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Tooltip";
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
  const [entries, setEntries] = useState<TimerEntry[]>([]);
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
  }, [inputValue]);

  const handleDeleteEntry = useCallback((index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      <div className="mt-8 flex flex-col items-center gap-8">
        <Timer
          onTick={handleTick}
          onRunningChange={handleRunningChange}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex w-full max-w-md gap-2">
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
              <TooltipContent sideOffset={8}>
                Start the timer before adding notes
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <div className="mt-4 flex w-full justify-center">
          <TimerEntriesTable
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>
      </div>
    </div>
  );
}
