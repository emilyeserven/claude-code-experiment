import type {
  BookmarkDisplay,
  GrammarBookmark,
  GrammarPoint,
  GrammarRow,
  Resource,
} from "./-data/types";

import { createFileRoute, Link } from "@tanstack/react-router";

import { GrammarTable } from "./-components/GrammarTable";
import bookmarksData from "./-data/grammarBookmarks.json";
import grammarPointsData from "./-data/grammarPoints.json";
import resourcesData from "./-data/resources.json";

const grammarPoints = grammarPointsData as GrammarPoint[];
const resources = resourcesData as Resource[];
const bookmarks = bookmarksData as GrammarBookmark[];

const resourceNameById = new Map(resources.map(r => [r.id, r.name]));

const bookmarksByJlpt = new Map<string, BookmarkDisplay[]>();
for (const b of bookmarks) {
  const resourceName = resourceNameById.get(b.resource);
  if (!resourceName) continue;
  const list = bookmarksByJlpt.get(b.jlpt) ?? [];
  list.push({
    resourceName,
    location: b.location,
  });
  bookmarksByJlpt.set(b.jlpt, list);
}

const rows: GrammarRow[] = grammarPoints.map(g => ({
  ...g,
  bookmarks: bookmarksByJlpt.get(g.id) ?? [],
}));

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

      <div className="mt-3">
        <Link
          to="/grammar/resources"
          className={`
            text-sm text-primary
            hover:underline
          `}
          data-testid="grammar-resources-link"
        >
          Browse resources →
        </Link>
      </div>

      <div className="mt-6">
        <GrammarTable rows={rows} />
      </div>
    </div>
  );
}
