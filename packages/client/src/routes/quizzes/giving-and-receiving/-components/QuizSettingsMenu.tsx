import type { Mode } from "../-utils/types";

import { Settings } from "lucide-react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

import { MODES } from "../-utils/types";

interface QuizSettingsMenuProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function QuizSettingsMenu({
  mode,
  onModeChange,
}: QuizSettingsMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="quiz-settings-trigger"
        >
          <Settings className="size-5" />
          <span className="sr-only">Quiz settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64"
      >
        <div className="space-y-3">
          <h4
            className="text-sm leading-none font-medium"
            data-testid="quiz-settings-heading"
          >
            Question type
          </h4>
          <div
            className="flex flex-wrap gap-2"
            data-testid="quiz-mode-selector"
          >
            {MODES.map(m => (
              <Button
                key={m.mode}
                variant={mode === m.mode ? "default" : "outline"}
                size="sm"
                className={cn(mode === m.mode && "ring-2 ring-ring")}
                onClick={() => { onModeChange(m.mode); }}
                data-testid={m.testId}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
