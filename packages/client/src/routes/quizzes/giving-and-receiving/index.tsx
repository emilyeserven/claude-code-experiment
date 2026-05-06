import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";

import { GivingReceivingQuiz } from "./-components/GivingReceivingQuiz";

export const Route = createFileRoute("/quizzes/giving-and-receiving/")({
  component: GivingAndReceivingPage,
});

function DescriptionContent() {
  return (
    <>
      Practice
      {" "}
      <span className="font-semibold">あげる・くれる・もらう</span>
      {" "}
      and their て-form versions:
      {" "}
      <span className="font-semibold">てあげる・てくれる・てもらう</span>
      .
    </>
  );
}

function GivingAndReceivingPage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div
      className="mx-auto max-w-3xl p-4"
      data-testid="giving-receiving-page"
    >
      <Link
        to="/quizzes"
        className={`
          text-sm text-muted-foreground
          hover:underline
        `}
        data-testid="giving-receiving-back-link"
      >
        ← Back to Quizzes
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <h2
          className="text-2xl font-semibold"
          data-testid="giving-receiving-heading"
        >
          Giving and Receiving
        </h2>
        {hasStarted && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="About this quiz"
                  className={`
                    inline-flex text-muted-foreground
                    hover:text-foreground
                    focus-visible:ring-2 focus-visible:ring-ring
                    focus-visible:outline-none
                  `}
                  data-testid="giving-receiving-description-trigger"
                >
                  <Info className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="max-w-xs"
                data-testid="giving-receiving-description-tooltip"
              >
                <DescriptionContent />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {!hasStarted && (
        <p
          className="mt-1 text-sm text-muted-foreground"
          data-testid="giving-receiving-description"
        >
          <DescriptionContent />
        </p>
      )}

      <div className="mt-6">
        <GivingReceivingQuiz onStart={() => { setHasStarted(true); }} />
      </div>
    </div>
  );
}
