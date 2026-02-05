import { useState, useRef, useCallback, useEffect } from "react";

import { Button } from "@/components/Button";
import { formatTime } from "@/utils/formatTime";

interface TimerProps {

  onTick?: (elapsedMs: number) => void;

  onRunningChange?: (isRunning: boolean) => void;
}

export function Timer({
  onTick,
  onRunningChange,
}: TimerProps) {
  const [elapsedMs, setElapsedMs] = useState(() => {
    try {
      const saved = localStorage.getItem("timer-elapsed-ms");
      return saved !== null ? JSON.parse(saved) as number : 0;
    }
    catch {
      return 0;
    }
  });
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;
  const onRunningChangeRef = useRef(onRunningChange);
  onRunningChangeRef.current = onRunningChange;

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    onRunningChangeRef.current?.(true);
    startTimeRef.current = Date.now() - elapsedMs;
    intervalRef.current = setInterval(() => {
      const newElapsed = Date.now() - startTimeRef.current;
      setElapsedMs(newElapsed);
      onTickRef.current?.(newElapsed);
    }, 10);
  }, [isRunning, elapsedMs]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    onRunningChangeRef.current?.(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const currentElapsed = Date.now() - startTimeRef.current;
    try {
      localStorage.setItem("timer-elapsed-ms", JSON.stringify(currentElapsed));
    }
    catch { /* noop */ }
  }, [isRunning]);

  useEffect(() => {
    // Sync restored elapsed time to parent on mount
    if (elapsedMs > 0) {
      onTickRef.current?.(elapsedMs);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    onRunningChangeRef.current?.(false);
    setElapsedMs(0);
    onTickRef.current?.(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    try {
      localStorage.setItem("timer-elapsed-ms", JSON.stringify(0));
    }
    catch { /* noop */ }
  }, []);

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
          variant={isRunning ? "secondary" : "default"}
          disabled={isRunning}
          data-testid="timer-start-button"
        >
          Start Timer
        </Button>
        <Button
          onClick={stop}
          variant={isRunning ? "default" : "secondary"}
          disabled={!isRunning}
          data-testid="timer-stop-button"
        >
          Stop Timer
        </Button>
        <Button
          onClick={reset}
          variant="destructive"
          data-testid="timer-reset-button"
        >
          Reset Timer
        </Button>
      </div>
    </div>
  );
}
