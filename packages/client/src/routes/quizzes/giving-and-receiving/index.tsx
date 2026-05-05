import { createFileRoute, Link } from "@tanstack/react-router";

import { GivingReceivingQuiz } from "./-components/GivingReceivingQuiz";

export const Route = createFileRoute("/quizzes/giving-and-receiving/")({
  component: GivingAndReceivingPage,
});

function GivingAndReceivingPage() {
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
      <h2
        className="mt-2 text-2xl font-semibold"
        data-testid="giving-receiving-heading"
      >
        Giving and Receiving
      </h2>
      <p
        className="mt-1 text-sm text-muted-foreground"
        data-testid="giving-receiving-description"
      >
        Practice
        {" "}
        <span className="font-semibold">あげる・くれる・もらう</span>
        {" "}
        and their て-form versions:
        {" "}
        <span className="font-semibold">てあげる・てくれる・てもらう</span>
        .
      </p>

      <div className="mt-6">
        <GivingReceivingQuiz />
      </div>
    </div>
  );
}
