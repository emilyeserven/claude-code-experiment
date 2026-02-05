import { useCallback, useRef, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Timer } from "@/components/Timer";
import { TimerEntriesTable } from "@/components/TimerEntriesTable";
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
  const elapsedMsRef = useRef(0);

  const handleTick = useCallback((elapsedMs: number) => {
    elapsedMsRef.current = elapsedMs;
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    setEntries(prev => [...prev, {
      text: inputValue.trim(),
      timestamp: formatTime(elapsedMsRef.current),
    }]);
    setInputValue("");
  }, [inputValue]);

  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      <div className="mt-8 flex flex-col items-center gap-6">
        <Timer onTick={handleTick} />
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
          <TimerEntriesTable entries={entries} />
        )}
      </div>
    </div>
  );
}
