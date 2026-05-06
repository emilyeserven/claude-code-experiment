import type { GrammarPoint, Sentence } from "../-utils/types";

import { useCallback, useMemo, useState } from "react";

import { getWrongAnswerFeedback, GRAMMAR_POINT_SUMMARIES } from "../-utils/feedback";
import { GRAMMAR_POINT_LABELS, GRAMMAR_POINTS } from "../-utils/types";

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
    const itemI = result[i];
    const itemJ = result[j];
    if (itemI === undefined || itemJ === undefined) continue;
    result[i] = itemJ;
    result[j] = itemI;
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
  const [viewing, setViewing] = useState<GrammarPoint | null>(null);

  const order = useMemo(
    () => shuffleWithSeed(
      GRAMMAR_POINTS,
      shuffleSeed ?? Math.floor(Math.random() * 1_000_000),
    ),
    [shuffleSeed],
  );

  const handleSelect = useCallback((point: GrammarPoint) => {
    if (selected !== null) {
      setViewing(current => (current === point ? null : point));
      return;
    }
    setSelected(point);
    onResult?.(point === sentence.grammarPoint);
  }, [selected, sentence.grammarPoint, onResult]);

  const handleNext = useCallback(() => {
    setSelected(null);
    setViewing(null);
    onNext();
  }, [onNext]);

  const isAnswered = selected !== null;
  const isCorrect = selected === sentence.grammarPoint;
  const feedback = selected !== null && !isCorrect
    ? getWrongAnswerFeedback(selected, sentence.grammarPoint)
    : null;
  const viewingTailored = viewing !== null && viewing !== sentence.grammarPoint
    ? getWrongAnswerFeedback(viewing, sentence.grammarPoint)
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
        Which grammar point fills the blank?
      </p>
      <p
        className="text-xl leading-relaxed"
        data-testid="grammar-point-grid-japanese"
      >
        {sentence.japaneseBlank}
      </p>
      <p
        className="text-base leading-relaxed text-muted-foreground"
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
          const isThisViewing = isAnswered && point === viewing;
          return (
            <Button
              key={point}
              variant="outline"
              size="lg"
              className={cn(
                "h-14 text-lg",
                isAnswered && isThisCorrect
                && `
                  border-green-600 bg-green-100 text-green-900
                  dark:bg-green-950 dark:text-green-100
                `,
                isAnswered && isThisSelected && !isThisCorrect
                && `
                  border-red-600 bg-red-100 text-red-900
                  dark:bg-red-950 dark:text-red-100
                `,
                isThisViewing && "ring-2 ring-blue-500 ring-offset-2",
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
              ? `
                border-green-600 bg-green-50 text-green-900
                dark:bg-green-950 dark:text-green-100
              `
              : `
                border-red-600 bg-red-50 text-red-900
                dark:bg-red-950 dark:text-red-100
              `,
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
          <p
            className="mt-3 text-xs opacity-75"
            data-testid="grammar-point-grid-explore-hint"
          >
            Tap any grammar point above to see its explanation.
          </p>
        </div>
      )}

      {isAnswered && viewing !== null && (
        <div
          className="rounded-md border bg-muted/50 p-3 text-sm"
          data-testid="grammar-point-grid-explanation"
        >
          <p
            className="font-medium"
            data-testid="grammar-point-grid-explanation-label"
          >
            {GRAMMAR_POINT_LABELS[viewing]}
          </p>
          <p className="mt-1">{GRAMMAR_POINT_SUMMARIES[viewing]}</p>
          {viewingTailored && (
            <p
              className="mt-2"
              data-testid="grammar-point-grid-explanation-tailored"
            >
              {viewingTailored}
            </p>
          )}
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
