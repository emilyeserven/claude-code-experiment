import type { GrammarBookmark, Resource } from "../-data/types";

import { createFileRoute, Link } from "@tanstack/react-router";

import bookmarksData from "../-data/grammarBookmarks.json";
import resourcesData from "../-data/resources.json";

const resources = resourcesData as Resource[];
const bookmarks = bookmarksData as GrammarBookmark[];

const bookmarkCountByResource = new Map<string, number>();
for (const b of bookmarks) {
  bookmarkCountByResource.set(b.resource, (bookmarkCountByResource.get(b.resource) ?? 0) + 1);
}

export const Route = createFileRoute("/grammar/resources/")({
  component: ResourcesIndex,
});

function ResourcesIndex() {
  return (
    <div
      className="mx-auto max-w-5xl p-4"
      data-testid="resources-page"
    >
      <Link
        to="/grammar"
        className={`
          text-sm text-muted-foreground
          hover:underline
        `}
        data-testid="resources-back-link"
      >
        ← Back to Grammar
      </Link>
      <h2
        className="mt-2 text-2xl font-semibold"
        data-testid="resources-heading"
      >
        Resources
      </h2>
      <p
        className="mt-1 text-sm text-muted-foreground"
        data-testid="resources-description"
      >
        Textbooks, websites, and drill books that teach JLPT grammar points.
      </p>

      <ul
        className="mt-6 flex flex-col gap-2"
        data-testid="resources-list"
      >
        {resources.map(resource => (
          <li key={resource.id}>
            <Link
              to="/grammar/resources/$resourceId"
              params={{
                resourceId: resource.id,
              }}
              className={`
                block rounded-md border p-3 transition-colors
                hover:bg-accent
              `}
              data-testid={`resources-link-${resource.id}`}
            >
              <p className="font-medium">{resource.name}</p>
              <p className="text-sm text-muted-foreground">
                <span className="capitalize">{resource.type}</span>
                {" · "}
                {bookmarkCountByResource.get(resource.id) ?? 0}
                {" "}
                bookmark
                {(bookmarkCountByResource.get(resource.id) ?? 0) === 1 ? "" : "s"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
