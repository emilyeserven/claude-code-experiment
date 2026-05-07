import type { GrammarPoint } from "../../-data/types";

interface BookmarkLocationGroup {
  location: string;
  grammarPoints: GrammarPoint[];
}

interface ResourceBookmarksProps {
  groups: BookmarkLocationGroup[];
}

export function ResourceBookmarks({
  groups,
}: ResourceBookmarksProps) {
  if (groups.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground"
        data-testid="resource-bookmarks-empty"
      >
        No bookmarks for this resource yet.
      </p>
    );
  }

  return (
    <ol
      className="flex flex-col gap-4"
      data-testid="resource-bookmarks-list"
    >
      {groups.map(group => (
        <li
          key={group.location}
          className="rounded-md border p-3"
          data-testid="resource-bookmark-group"
        >
          <p
            className="text-sm font-medium"
            data-testid="resource-bookmark-location"
          >
            Location
            {" "}
            {group.location}
          </p>
          <ul
            className="mt-2 flex flex-col gap-1"
            data-testid="resource-bookmark-grammar-points"
          >
            {group.grammarPoints.map(g => (
              <li
                key={g.id}
                className="flex flex-wrap items-baseline gap-2 text-sm"
                data-testid="resource-bookmark-grammar-point"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {g.level}
                  -
                  {g.number}
                </span>
                <span
                  className="font-medium"
                  lang="ja"
                >
                  {g.japanese}
                </span>
                <span className="text-muted-foreground">
                  {g.english}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export type { BookmarkLocationGroup };
