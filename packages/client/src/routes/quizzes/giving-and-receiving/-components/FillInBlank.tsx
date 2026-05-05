import type { Sentence } from "../-utils/types";

import { useCallback, useMemo, useState } from "react";

import { Button, Input } from "@/components/ui";
import { romajiToHiragana } from "@/utils/romajiToHiragana";

import { getWrongAnswerFeedback, GRAMMAR_POINT_SUMMARIES } from "../-utils/feedback";
import { GRAMMAR_POINT_LABELS } from "../-utils/types";

interface FillInBlankProps {

  sentence: Sentence;

  onNext: () => void;

  onResult?: (wasCorrect: boolean) => void;
}

type Status = "input" | "correct" | "incorrect";

function guessGrammarPoint(answer: string): Sentence["grammarPoint"] | null {
  if (answer.startsWith("てあ") || answer.startsWith("であ")) return "te-ageru";
  if (answer.startsWith("てく") || answer.startsWith("でく")) return "te-kureru";
  if (answer.startsWith("ても") || answer.startsWith("でも")) return "te-morau";
  if (answer.startsWith("あ")) return "ageru";
  if (answer.startsWith("く")) return "kureru";
  if (answer.startsWith("も")) return "morau";
  return null;
}

export function FillInBlank({
  sentence, onNext, onResult,
}: FillInBlankProps) {
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<Status>("input");

  const hiragana = useMemo(() => romajiToHiragana(raw), [raw]);

  const handleSubmit = useCallback(() => {
    if (status !== "input") return;
    if (!hiragana) return;
    const isCorrect = sentence.acceptableAnswers.includes(hiragana);
    setStatus(isCorrect ? "correct" : "incorrect");
    onResult?.(isCorrect);
  }, [hiragana, sentence.acceptableAnswers, status, onResult]);

  const handleNext = useCallback(() => {
    setRaw("");
    setStatus("input");
    onNext();
  }, [onNext]);

  const guessed = guessGrammarPoint(hiragana);
  const failureNote
    = status === "incorrect" && guessed && guessed !== sentence.grammarPoint
      ? getWrongAnswerFeedback(guessed, sentence.grammarPoint)
      : null;

  const blankParts = sentence.japaneseBlank.split("___");

  return (
    <div
      className="flex flex-col gap-4"
      data-testid="fill-in-blank"
    >
      <p
        className="text-sm text-muted-foreground"
        data-testid="fill-in-blank-english"
      >
        {sentence.english}
      </p>
      <p
        className="text-2xl leading-relaxed"
        data-testid="fill-in-blank-sentence"
      >
        {blankParts[0]}
        <span
          className={`
            mx-1 inline-block min-w-24 rounded-md border-b-2 border-dashed px-2
            text-center
            ${status === "correct"
      ? `
        border-green-600 text-green-700
        dark:text-green-400
      `
      : ""}
            ${status === "incorrect"
      ? `
        border-red-600 text-red-700
        dark:text-red-400
      `
      : ""}
          `}
          data-testid="fill-in-blank-display"
        >
          {hiragana || " "}
        </span>
        {blankParts[1]}
      </p>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium"
          htmlFor="fib-input"
        >
          Type the missing verb (romaji → hiragana)
        </label>
        <div className="flex gap-2">
          <Input
            id="fib-input"
            value={raw}
            disabled={status !== "input"}
            onChange={(e) => { setRaw(e.target.value); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="e.g. ageta, kuremashita, moratta..."
            data-testid="fill-in-blank-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {status === "input"
            ? (
              <Button
                onClick={handleSubmit}
                disabled={!hiragana}
                data-testid="fill-in-blank-submit"
              >
                Check
              </Button>
            )
            : (
              <Button
                onClick={handleNext}
                data-testid="fill-in-blank-next"
              >
                Next
              </Button>
            )}
        </div>
      </div>

      {status === "correct" && (
        <div
          className={`
            rounded-md border border-green-600 bg-green-50 p-3 text-sm
            text-green-900
            dark:bg-green-950 dark:text-green-100
          `}
          data-testid="fill-in-blank-correct"
        >
          <p className="font-medium">Correct!</p>
          <p className="mt-1">
            Full sentence:
            {" "}
            <span className="font-semibold">{sentence.japanese}</span>
          </p>
        </div>
      )}

      {status === "incorrect" && (
        <div
          className={`
            rounded-md border border-red-600 bg-red-50 p-3 text-sm text-red-900
            dark:bg-red-950 dark:text-red-100
          `}
          data-testid="fill-in-blank-incorrect"
        >
          <p className="font-medium">
            Not quite. The answer was
            {" "}
            <span className="font-semibold">{sentence.acceptableAnswers[0]}</span>
            {" "}
            (
            {GRAMMAR_POINT_LABELS[sentence.grammarPoint]}
            ).
          </p>
          {failureNote && (
            <p
              className="mt-2"
              data-testid="fill-in-blank-failure-note"
            >
              {failureNote}
            </p>
          )}
          <p className="mt-2">
            {GRAMMAR_POINT_SUMMARIES[sentence.grammarPoint]}
          </p>
          <p className="mt-2">
            Full sentence:
            {" "}
            <span className="font-semibold">{sentence.japanese}</span>
          </p>
        </div>
      )}
    </div>
  );
}
