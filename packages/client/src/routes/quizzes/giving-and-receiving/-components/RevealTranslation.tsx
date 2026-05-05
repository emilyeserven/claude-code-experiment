import type { Sentence } from "../-utils/types";

import { useCallback, useState } from "react";

import { GRAMMAR_POINT_SUMMARIES } from "../-utils/feedback";
import { GRAMMAR_POINT_LABELS } from "../-utils/types";

import { Button } from "@/components/ui";

interface RevealTranslationProps {

  sentence: Sentence;

  onNext: () => void;

  onResult?: (rating: Rating) => void;
}

type Rating = "again" | "hard" | "good" | "easy";

const RATINGS: { rating: Rating;
  label: string;
  description: string;
  testId: string; }[] = [
  {
    rating: "again",
    label: "Didn't get it",
    description: "I didn't understand this — show me again soon.",
    testId: "rating-again",
  },
  {
    rating: "hard",
    label: "Hard",
    description: "I worked it out, but it was a struggle.",
    testId: "rating-hard",
  },
  {
    rating: "good",
    label: "Good",
    description: "I understood it.",
    testId: "rating-good",
  },
  {
    rating: "easy",
    label: "Easy",
    description: "I got it right away.",
    testId: "rating-easy",
  },
];

export function RevealTranslation({
  sentence, onNext, onResult,
}: RevealTranslationProps) {
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<Rating | null>(null);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleRate = useCallback((rating: Rating) => {
    setRated(rating);
    onResult?.(rating);
  }, [onResult]);

  const handleNext = useCallback(() => {
    setRevealed(false);
    setRated(null);
    onNext();
  }, [onNext]);

  return (
    <div
      className="flex flex-col gap-4"
      data-testid="reveal-translation"
    >
      <p
        className="text-2xl leading-relaxed"
        data-testid="reveal-translation-japanese"
      >
        {sentence.japanese}
      </p>

      {!revealed && (
        <Button
          onClick={handleReveal}
          variant="outline"
          data-testid="reveal-translation-button"
        >
          Reveal translation
        </Button>
      )}

      {revealed && (
        <div
          className="flex flex-col gap-3"
          data-testid="reveal-translation-revealed"
        >
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-sm font-medium text-muted-foreground">
              Translation
            </p>
            <p
              className="mt-1 text-base"
              data-testid="reveal-translation-english"
            >
              {sentence.english}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Grammar:
              {" "}
              <span className="font-semibold">
                {GRAMMAR_POINT_LABELS[sentence.grammarPoint]}
              </span>
              {" — "}
              {GRAMMAR_POINT_SUMMARIES[sentence.grammarPoint]}
            </p>
          </div>

          {rated === null && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">How well did you understand?</p>
              <div
                className={`
                  grid grid-cols-2 gap-2
                  sm:grid-cols-4
                `}
              >
                {RATINGS.map(r => (
                  <Button
                    key={r.rating}
                    variant="outline"
                    onClick={() => { handleRate(r.rating); }}
                    data-testid={r.testId}
                    title={r.description}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {rated !== null && (
            <div
              className="flex items-center justify-between"
              data-testid="reveal-translation-rated"
            >
              <p className="text-sm text-muted-foreground">
                Rated:
                {" "}
                <span className="font-semibold">
                  {RATINGS.find(r => r.rating === rated)?.label}
                </span>
              </p>
              <Button
                onClick={handleNext}
                data-testid="reveal-translation-next"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
