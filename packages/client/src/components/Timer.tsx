import { useState, useRef, useCallback, useEffect } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

interface TimerEntry {
  text: string;
  timestamp: string;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

export function Timer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [entries, setEntries] = useState<TimerEntry[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedMs;
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 10);
  }, [isRunning, elapsedMs]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedMs(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    setEntries(prev => [...prev, {
      text: inputValue.trim(),
      timestamp: formatTime(elapsedMs),
    }]);
    setInputValue("");
  }, [inputValue, elapsedMs]);

  return (
    <div
      className="flex flex-col items-center gap-6"
      data-testid="timer-component-root"
    >
      <div
        className="font-mono text-5xl font-bold tracking-tight tabular-nums"
        data-testid="timer-display"
      >
        {formatTime(elapsedMs)}
      </div>
      <div className="flex gap-3">
        <Button
          onClick={start}
          disabled={isRunning}
          data-testid="timer-start-button"
        >
          Start Timer
        </Button>
        <Button
          onClick={stop}
          variant="secondary"
          disabled={!isRunning}
          data-testid="timer-stop-button"
        >
          Stop Timer
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          data-testid="timer-reset-button"
        >
          Reset Timer
        </Button>
      </div>
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
      {entries.length > 0 && (
        <ul
          className="w-full max-w-md space-y-2"
          data-testid="timer-entries-list"
        >
          {entries.map((entry, index) => (
            <li
              key={index}
              className={`
                flex justify-between rounded-md border px-3 py-2
                dark:border-gray-600
              `}
              data-testid="timer-entry"
            >
              <span>{entry.text}</span>
              <span className="font-mono text-sm text-muted-foreground">
                {entry.timestamp}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
