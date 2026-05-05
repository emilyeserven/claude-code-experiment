import { useCallback, useMemo, useState } from "react";

import type { GrammarPoint, Sentence } from "./types";

import { getWrongAnswerFeedback, GRAMMAR_POINT_SUMMARIES } from "./feedback";
import { GRAMMAR_POINT_LABELS, GRAMMAR_POINTS } from "./types";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface GrammarPointGridProps {

  sentence: Sentence;

  onNext: () => void;

  onResult?: (wasCorrect: boolean) => void;

  shuffleSeed?: number;
}

function shuffleWithSeed(items: readonly GrammarPoint[], seed: number): GrammarPoint[] {
  const result = [...items];
  let s = seed || 1;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function GrammarPointGrid({
  sentence,
  onNext,
  onResult,
  shuffleSeed,
}: GrammarPointGridProps) {
  const [selected, setSelected] = useState<GrammarPoint | null>(null);

  const order = useMemo(
    () => shuffleWithSeed(
      GRAMMAR_POINTS,
      shuffleSeed ?? Math.floor(Math.random() * 1_000_000),
    ),
    [shuffleSeed],
  );

  const handleSelect = useCallback((point: GrammarPoint) => {
    if (selected !== null) return;
    setSelected(point);
    onResult?.(point === sentence.grammarPoint);
  }, [selected, sentence.grammarPoint, onResult]);

  const handleNext = useCallback(() => {
    setSelected(null);
    onNext();
  }, [onNext]);

  const isAnswered = selected !== null;
  const isCorrect = selected === sentence.grammarPoint;
  const feedback = selected !== null && !isCorrect
    ? getWrongAnswerFeedback(selected, sentence.grammarPoint)
    : null;

  return (
    <div
      className="flex flex-col gap-4"
      data-testid="grammar-point-grid"
    >
      <p
        className="text-sm font-medium text-muted-foreground"
        data-testid="grammar-point-grid-prompt"
      >
        Which grammar point fits this English sentence?
      </p>
      <p
        className="text-xl leading-relaxed"
        data-testid="grammar-point-grid-english"
      >
        {sentence.english}
      </p>

      <div
        className={`
          grid grid-cols-2 gap-2
          sm:grid-cols-3
        `}
        data-testid="grammar-point-grid-options"
      >
        {order.map((point) => {
          const isThisCorrect = point === sentence.grammarPoint;
          const isThisSelected = point === selected;
          return (
            <Button
              key={point}
              variant="outline"
              size="lg"
              disabled={isAnswered && !isThisCorrect && !isThisSelected}
              className={cn(
                "h-14 text-lg",
                isAnswered && isThisCorrect
                && "border-green-600 bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100",
                isAnswered && isThisSelected && !isThisCorrect
                && "border-red-600 bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
              )}
              onClick={() => { handleSelect(point); }}
              data-testid={`grammar-point-grid-option-${point}`}
            >
              {GRAMMAR_POINT_LABELS[point]}
            </Button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={cn(
            "rounded-md border p-3 text-sm",
            isCorrect
              ? "border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
              : "border-red-600 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100",
          )}
          data-testid="grammar-point-grid-feedback"
        >
          {isCorrect
            ? (
                <>
                  <p className="font-medium">Correct!</p>
                  <p className="mt-1">
                    {GRAMMAR_POINT_SUMMARIES[sentence.grammarPoint]}
                  </p>
                </>
              )
            : (
                <>
                  <p className="font-medium">
                    Not quite. The answer is
                    {" "}
                    {GRAMMAR_POINT_LABELS[sentence.grammarPoint]}
                    .
                  </p>
                  {feedback && (
                    <p
                      className="mt-2"
                      data-testid="grammar-point-grid-tailored"
                    >
                      {feedback}
                    </p>
                  )}
                </>
              )}
          <p className="mt-2">
            Sentence:
            {" "}
            <span className="font-semibold">{sentence.japanese}</span>
          </p>
        </div>
      )}

      {isAnswered && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            data-testid="grammar-point-grid-next"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
