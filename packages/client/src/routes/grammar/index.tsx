import type { GrammarPoint } from "./-data/types";

import { createFileRoute } from "@tanstack/react-router";

import { GrammarTable } from "./-components/GrammarTable";
import grammarPointsData from "./-data/grammarPoints.json";

const grammarPoints = grammarPointsData as GrammarPoint[];

export const Route = createFileRoute("/grammar/")({
  component: GrammarPage,
});

function GrammarPage() {
  return (
    <div
      className="mx-auto max-w-5xl p-4"
      data-testid="grammar-page"
    >
      <h2
        className="text-2xl font-semibold"
        data-testid="grammar-heading"
      >
        Grammar
      </h2>
      <p
        className="mt-1 text-sm text-muted-foreground"
        data-testid="grammar-description"
      >
        Browse JLPT grammar points and the resources where they&apos;re explained.
      </p>

      <div className="mt-6">
        <GrammarTable grammarPoints={grammarPoints} />
      </div>
    </div>
  );
}
