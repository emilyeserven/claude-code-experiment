import type { BookmarkLocationGroup } from "./-components/ResourceBookmarks";
import type { GrammarBookmark, GrammarPoint, Resource } from "../-data/types";

import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { ResourceBookmarks } from "./-components/ResourceBookmarks";
import bookmarksData from "../-data/grammarBookmarks.json";
import grammarPointsData from "../-data/grammarPoints.json";
import resourcesData from "../-data/resources.json";

const resources = resourcesData as Resource[];
const allBookmarks = bookmarksData as GrammarBookmark[];
const grammarPoints = grammarPointsData as GrammarPoint[];

const grammarPointById = new Map(grammarPoints.map(g => [g.id, g]));
const bookmarkById = new Map(allBookmarks.map(b => [b.id, b]));

export const Route = createFileRoute("/grammar/resources/$resourceId")({
  loader: ({
    params,
  }) => {
    const resource = resources.find(r => r.id === params.resourceId);
    if (!resource) throw notFound();

    const groupsMap = new Map<string, GrammarPoint[]>();
    for (const bookmarkId of resource.bookmarks) {
      const bookmark = bookmarkById.get(bookmarkId);
      if (!bookmark) continue;
      const grammarPoint = grammarPointById.get(bookmark.jlpt);
      if (!grammarPoint) continue;
      const list = groupsMap.get(bookmark.location) ?? [];
      list.push(grammarPoint);
      groupsMap.set(bookmark.location, list);
    }

    const groups: BookmarkLocationGroup[] = [...groupsMap.entries()].map(
      ([location, grammarPoints]) => ({
        location,
        grammarPoints,
      }),
    );

    return {
      resource,
      groups,
    };
  },
  component: ResourceDetailPage,
  notFoundComponent: ResourceNotFound,
});

function ResourceNotFound() {
  return (
    <div
      className="mx-auto max-w-3xl p-4"
      data-testid="resource-not-found"
    >
      <Link
        to="/grammar/resources"
        className={`
          text-sm text-muted-foreground
          hover:underline
        `}
      >
        ← Back to Resources
      </Link>
      <p className="mt-4 text-sm">Resource not found.</p>
    </div>
  );
}

function ResourceDetailPage() {
  const {
    resource, groups,
  } = Route.useLoaderData();

  return (
    <div
      className="mx-auto max-w-3xl p-4"
      data-testid="resource-detail-page"
    >
      <Link
        to="/grammar/resources"
        className={`
          text-sm text-muted-foreground
          hover:underline
        `}
        data-testid="resource-detail-back-link"
      >
        ← Back to Resources
      </Link>
      <h2
        className="mt-2 text-2xl font-semibold"
        data-testid="resource-detail-heading"
      >
        {resource.name}
      </h2>
      <p
        className="mt-1 text-sm text-muted-foreground"
        data-testid="resource-detail-type"
      >
        <span className="capitalize">{resource.type}</span>
      </p>

      <div className="mt-6">
        <ResourceBookmarks groups={groups} />
      </div>
    </div>
  );
}
