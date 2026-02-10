import { useCallback, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button, Input } from "@/components/ui";

interface CaptureEntry {
  directions: string;
  prompt: string;
  capturedAt: string;
}

export const Route = createFileRoute("/capture")({
  component: Capture,
});

const STORAGE_KEY = "capture-entries";

function loadEntries(): CaptureEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CaptureEntry[];
    }
  }
  catch {
    // ignore parse errors
  }
  return [];
}

function saveEntries(entries: CaptureEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function Capture() {
  const [directions, setDirections] = useState("");
  const [prompt, setPrompt] = useState("");
  const [entries, setEntries] = useState<CaptureEntry[]>(loadEntries);

  const handleSubmit = useCallback(() => {
    if (!directions.trim() && !prompt.trim()) return;
    const entry: CaptureEntry = {
      directions: directions.trim(),
      prompt: prompt.trim(),
      capturedAt: new Date().toISOString(),
    };
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
    setDirections("");
    setPrompt("");
  }, [directions, prompt, entries]);

  const handleClearAll = useCallback(() => {
    setEntries([]);
    saveEntries([]);
  }, []);

  const handleExport = useCallback(() => {
    const text = entries
      .map(
        (e, i) =>
          `--- Entry ${String(i + 1)} (${e.capturedAt}) ---\nDirections:\n${e.directions}\n\nPrompt:\n${e.prompt}`,
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }, [entries]);

  return (
    <div className="p-4">
      <h2 data-testid="capture-heading">Capture</h2>
      <p
        className="mb-4 text-sm text-muted-foreground"
        data-testid="capture-description"
      >
        Record the current state of your AI directions and prompts for later
        analysis.
      </p>

      <div className="flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="directions-input"
          >
            AI Directions
          </label>
          <textarea
            id="directions-input"
            value={directions}
            onChange={e => setDirections(e.target.value)}
            placeholder="Paste or type your current AI directions..."
            rows={4}
            className={`
              w-full resize-none rounded-md border bg-transparent px-3 py-2
              text-sm
              focus:ring-2 focus:ring-ring focus:outline-none
            `}
            data-testid="directions-input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="prompt-input"
          >
            Prompt
          </label>
          <Input
            id="prompt-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Enter the prompt you used..."
            data-testid="prompt-input"
          />
        </div>

        <Button
          onClick={handleSubmit}
          data-testid="capture-submit"
        >
          Save Entry
        </Button>
      </div>

      {entries.length > 0 && (
        <div
          className="mt-8"
          data-testid="entries-section"
        >
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-medium">
              Saved Entries ({entries.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-testid="export-button"
            >
              Copy All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              data-testid="clear-all-button"
            >
              Clear All
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {entries.map((entry, index) => (
              <div
                key={entry.capturedAt}
                className="rounded-md border p-3"
                data-testid={`entry-${String(index)}`}
              >
                <p className="mb-1 text-xs text-muted-foreground">
                  {new Date(entry.capturedAt).toLocaleString()}
                </p>
                {entry.directions && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Directions:</p>
                    <p
                      className="text-sm whitespace-pre-wrap"
                      data-testid={`entry-${String(index)}-directions`}
                    >
                      {entry.directions}
                    </p>
                  </div>
                )}
                {entry.prompt && (
                  <div>
                    <p className="text-sm font-medium">Prompt:</p>
                    <p
                      className="text-sm"
                      data-testid={`entry-${String(index)}-prompt`}
                    >
                      {entry.prompt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
