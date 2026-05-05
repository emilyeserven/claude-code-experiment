import { useCallback, useMemo, useState } from "react";

import type { Sentence } from "./types";

import { FillInBlank } from "./FillInBlank";
import { GrammarPointGrid } from "./GrammarPointGrid";
import { RevealTranslation } from "./RevealTranslation";
import { SENTENCES } from "./sentences";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type Mode = "mixed" | "fill-in-blank" | "reveal-translation" | "grammar-point-grid";

const MODES: { mode: Mode; label: string; testId: string }[] = [
  { mode: "mixed", label: "Mixed", testId: "mode-mixed" },
  { mode: "fill-in-blank", label: "Fill in the blank", testId: "mode-fill-in-blank" },
  { mode: "reveal-translation", label: "Reveal translation", testId: "mode-reveal-translation" },
  { mode: "grammar-point-grid", label: "Pick the grammar point", testId: "mode-grammar-point-grid" },
];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function modeForRound(mode: Mode): Exclude<Mode, "mixed"> {
  if (mode === "mixed") {
    return pickRandom([
      "fill-in-blank",
      "reveal-translation",
      "grammar-point-grid",
    ] as const);
  }
  return mode;
}

interface QuizState {
  sentence: Sentence;
  mode: Exclude<Mode, "mixed">;
  shuffleSeed: number;
}

function newRound(mode: Mode, exclude?: string): QuizState {
  const pool = exclude
    ? SENTENCES.filter(s => s.id !== exclude)
    : SENTENCES;
  return {
    sentence: pickRandom(pool),
    mode: modeForRound(mode),
    shuffleSeed: Math.floor(Math.random() * 1_000_000),
  };
}

export function GivingReceivingQuiz() {
  const [mode, setMode] = useState<Mode>("mixed");
  const [round, setRound] = useState<QuizState>(() => newRound("mixed"));
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleNext = useCallback(() => {
    setRound(prev => newRound(mode, prev.sentence.id));
  }, [mode]);

  const handleResult = useCallback((wasCorrect: boolean) => {
    setScore(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, []);

  const handleRevealRated = useCallback(() => {
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
  }, []);

  const handleSetMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setRound(newRound(newMode));
  }, []);

  const accuracy = useMemo(() => {
    if (score.total === 0) return null;
    return Math.round((score.correct / score.total) * 100);
  }, [score]);

  return (
    <div
      className="flex flex-col gap-6"
      data-testid="giving-receiving-quiz"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Question type</p>
        <div
          className={`
            flex flex-wrap gap-2
          `}
          data-testid="quiz-mode-selector"
        >
          {MODES.map(m => (
            <Button
              key={m.mode}
              variant={mode === m.mode ? "default" : "outline"}
              size="sm"
              className={cn(mode === m.mode && "ring-2 ring-ring")}
              onClick={() => { handleSetMode(m.mode); }}
              data-testid={m.testId}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      <div
        className="text-sm text-muted-foreground"
        data-testid="quiz-score"
      >
        Score:
        {" "}
        {score.correct}
        {" "}
        /
        {" "}
        {score.total}
        {accuracy !== null && (
          <>
            {" "}
            (
            {accuracy}
            %)
          </>
        )}
      </div>

      <div
        key={round.sentence.id + round.mode}
        className="rounded-lg border p-4"
        data-testid={`quiz-round-${round.mode}`}
      >
        {round.mode === "fill-in-blank" && (
          <FillInBlank
            sentence={round.sentence}
            onNext={handleNext}
            onResult={handleResult}
          />
        )}
        {round.mode === "reveal-translation" && (
          <RevealTranslation
            sentence={round.sentence}
            onNext={handleNext}
            onResult={handleRevealRated}
          />
        )}
        {round.mode === "grammar-point-grid" && (
          <GrammarPointGrid
            sentence={round.sentence}
            onNext={handleNext}
            onResult={handleResult}
            shuffleSeed={round.shuffleSeed}
          />
        )}
      </div>
    </div>
  );
}
