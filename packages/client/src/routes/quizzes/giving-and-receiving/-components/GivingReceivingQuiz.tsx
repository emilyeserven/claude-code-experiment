import type { Mode, Sentence } from "../-utils/types";

import { useCallback, useMemo, useRef, useState } from "react";

import { FillInBlank } from "./FillInBlank";
import { GrammarPointGrid } from "./GrammarPointGrid";
import { QuizSettingsMenu } from "./QuizSettingsMenu";
import { RevealTranslation } from "./RevealTranslation";
import { SENTENCES } from "../-utils/sentences";

function pickRandom<T>(items: readonly T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  if (item === undefined) {
    throw new Error("pickRandom called on empty array");
  }
  return item;
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

interface QuizSession {
  round: QuizState;
  seen: ReadonlySet<string>;
}

function nextSession(mode: Mode, seen: ReadonlySet<string>): QuizSession {
  const remaining = SENTENCES.filter(s => !seen.has(s.id));
  const exhausted = remaining.length === 0;
  const pool = exhausted ? SENTENCES : remaining;
  const sentence = pickRandom(pool);
  const nextSeen = exhausted ? new Set<string>() : new Set(seen);
  nextSeen.add(sentence.id);
  return {
    round: {
      sentence,
      mode: modeForRound(mode),
      shuffleSeed: Math.floor(Math.random() * 1_000_000),
    },
    seen: nextSeen,
  };
}

interface GivingReceivingQuizProps {
  onStart?: () => void;
}

export function GivingReceivingQuiz({
  onStart,
}: GivingReceivingQuizProps = {}) {
  const [mode, setMode] = useState<Mode>("mixed");
  const [session, setSession] = useState<QuizSession>(() =>
    nextSession("mixed", new Set()));
  const [score, setScore] = useState({
    correct: 0,
    total: 0,
  });
  const startedRef = useRef(false);

  const markStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    onStart?.();
  }, [onStart]);

  const handleNext = useCallback(() => {
    setSession(prev => nextSession(mode, prev.seen));
  }, [mode]);

  const handleResult = useCallback((wasCorrect: boolean) => {
    markStarted();
    setScore(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [markStarted]);

  const handleRevealRated = useCallback(() => {
    markStarted();
    setScore(prev => ({
      ...prev,
      total: prev.total + 1,
    }));
  }, [markStarted]);

  const handleSetMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setSession(prev => nextSession(newMode, prev.seen));
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
      <div className="flex items-center justify-between gap-2">
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
        <QuizSettingsMenu
          mode={mode}
          onModeChange={handleSetMode}
        />
      </div>

      <div
        key={session.round.sentence.id + session.round.mode}
        className="rounded-lg border p-4"
        data-testid={`quiz-round-${session.round.mode}`}
      >
        {session.round.mode === "fill-in-blank" && (
          <FillInBlank
            sentence={session.round.sentence}
            onNext={handleNext}
            onResult={handleResult}
          />
        )}
        {session.round.mode === "reveal-translation" && (
          <RevealTranslation
            sentence={session.round.sentence}
            onNext={handleNext}
            onResult={handleRevealRated}
          />
        )}
        {session.round.mode === "grammar-point-grid" && (
          <GrammarPointGrid
            sentence={session.round.sentence}
            onNext={handleNext}
            onResult={handleResult}
            shuffleSeed={session.round.shuffleSeed}
          />
        )}
      </div>
    </div>
  );
}
