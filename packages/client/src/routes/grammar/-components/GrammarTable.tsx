import type { BookmarkDisplay, GrammarRow, JlptLevel } from "../-data/types";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter } from "lucide-react";

import { Button, Checkbox, Input, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { romajiToHiragana } from "@/utils/romajiToHiragana";

import { JLPT_LEVELS } from "../-data/types";

interface GrammarTableProps {
  rows: GrammarRow[];
}

type BookmarkFilter = "all" | "with" | "without";

function SortableHeader({
  label, sorted, onClick,
}: { label: string;
  sorted: false | "asc" | "desc";
  onClick: () => void; }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1"
      onClick={onClick}
    >
      {label}
      {sorted === "asc"
        ? <ArrowUp className="size-3.5" />
        : sorted === "desc"
          ? <ArrowDown className="size-3.5" />
          : <ArrowUpDown className="size-3.5 opacity-50" />}
    </button>
  );
}

function groupBookmarksByResource(bookmarks: BookmarkDisplay[]): { resourceName: string;
  locations: string[]; }[] {
  const groups = new Map<string, string[]>();
  for (const b of bookmarks) {
    const list = groups.get(b.resourceName) ?? [];
    list.push(b.location);
    groups.set(b.resourceName, list);
  }
  return [...groups.entries()].map(([resourceName, locations]) => ({
    resourceName,
    locations,
  }));
}

const columns: ColumnDef<GrammarRow>[] = [
  {
    accessorKey: "level",
    header: ({
      column,
    }) => (
      <SortableHeader
        label="Level"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    enableSorting: true,
    meta: {
      className: "w-20",
    },
  },
  {
    accessorKey: "number",
    header: ({
      column,
    }) => (
      <SortableHeader
        label="#"
        sorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    enableSorting: true,
    meta: {
      className: "w-16",
    },
  },
  {
    accessorKey: "japanese",
    header: "Japanese",
    cell: ({
      getValue,
    }) => (
      <span
        className="font-medium"
        lang="ja"
      >
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "english",
    header: "English",
  },
  {
    accessorKey: "bookmarks",
    header: "Bookmarks",
    enableSorting: false,
    cell: ({
      row,
    }) => {
      const groups = groupBookmarksByResource(row.original.bookmarks);
      return (
        <span data-testid="grammar-bookmarks">
          {groups.map((g, i) => (
            <span key={g.resourceName}>
              {i > 0 ? "; " : ""}
              {g.resourceName}
              :
              {" "}
              {g.locations.join(", ")}
            </span>
          ))}
        </span>
      );
    },
  },
];

interface FilterState {
  search: string;
  levels: Set<JlptLevel>;
  bookmarkFilter: BookmarkFilter;
}

function rowMatches(row: GrammarRow, filters: FilterState): boolean {
  if (filters.levels.size > 0 && !filters.levels.has(row.level)) return false;

  if (filters.bookmarkFilter === "with" && row.bookmarks.length === 0) return false;
  if (filters.bookmarkFilter === "without" && row.bookmarks.length > 0) return false;

  const search = filters.search.trim();
  if (!search) return true;

  const needle = search.toLowerCase();
  const hiraganaNeedle = romajiToHiragana(search);

  if (row.level.toLowerCase().includes(needle)) return true;
  if (String(row.number).includes(needle)) return true;
  if (row.japanese.toLowerCase().includes(needle)) return true;
  if (hiraganaNeedle && row.japanese.includes(hiraganaNeedle)) return true;
  if (row.romaji.toLowerCase().includes(needle)) return true;
  if (row.english.toLowerCase().includes(needle)) return true;
  for (const b of row.bookmarks) {
    if (b.resourceName.toLowerCase().includes(needle)) return true;
    if (b.location.toLowerCase().includes(needle)) return true;
  }
  return false;
}

export function GrammarTable({
  rows,
}: GrammarTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<Set<JlptLevel>>(new Set());
  const [bookmarkFilter, setBookmarkFilter] = useState<BookmarkFilter>("all");

  const filteredRows = useMemo(() => {
    const filters: FilterState = {
      search,
      levels,
      bookmarkFilter,
    };
    return rows.filter(r => rowMatches(r, filters));
  }, [rows, search, levels, bookmarkFilter]);

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tableRows = table.getRowModel().rows;

  const toggleLevel = (level: JlptLevel) => {
    setLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const activeFilterCount
    = (levels.size > 0 ? 1 : 0) + (bookmarkFilter !== "all" ? 1 : 0);

  return (
    <div
      className="w-full"
      data-testid="grammar-table-root"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search (English, Japanese, romaji)..."
            className="max-w-sm"
            data-testid="grammar-search-input"
            aria-label="Search grammar points"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="grammar-filter-trigger"
              >
                <Filter className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className={`
                      ml-1 inline-flex size-5 items-center justify-center
                      rounded-full bg-primary text-xs text-primary-foreground
                    `}
                    data-testid="grammar-filter-badge"
                  >
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-64"
              data-testid="grammar-filter-content"
            >
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Level</p>
                  <div className="flex flex-col gap-2">
                    {JLPT_LEVELS.map(level => (
                      <label
                        key={level}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={levels.has(level)}
                          onCheckedChange={() => toggleLevel(level)}
                          data-testid={`grammar-filter-level-${level}`}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="mb-2 text-sm font-medium">Bookmarks</p>
                  <div className="flex flex-col gap-2">
                    {(["all", "with", "without"] as const).map((opt) => {
                      const labels: Record<BookmarkFilter, string> = {
                        all: "All",
                        with: "With bookmarks",
                        without: "Without bookmarks",
                      };
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            name="grammar-bookmark-filter"
                            checked={bookmarkFilter === opt}
                            onChange={() => setBookmarkFilter(opt)}
                            data-testid={`grammar-filter-bookmarks-${opt}`}
                          />
                          {labels[opt]}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <div className="border-t pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setLevels(new Set());
                        setBookmarkFilter("all");
                      }}
                      data-testid="grammar-filter-clear"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <span
          className="text-sm text-muted-foreground"
          data-testid="grammar-results-count"
        >
          {tableRows.length}
          {" "}
          of
          {" "}
          {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          data-testid="grammar-table"
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr
                key={headerGroup.id}
                className={`
                  border-b
                  dark:border-gray-600
                `}
              >
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={cn(
                      `
                        px-3 py-2 text-left text-sm font-medium
                        text-muted-foreground
                      `,
                      header.column.getCanSort() && "cursor-pointer select-none",
                      (header.column.columnDef.meta as { className?: string } | undefined)?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableRows.length > 0
              ? tableRows.map(row => (
                <tr
                  key={row.id}
                  className={`
                    border-b
                    last:border-b-0
                    dark:border-gray-600
                  `}
                  data-testid="grammar-row"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-3 py-2 align-top",
                        (cell.column.columnDef.meta as { className?: string } | undefined)?.className,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
              : (
                <tr>
                  <td
                    colSpan={table.getVisibleLeafColumns().length}
                    className={`
                      px-3 py-6 text-center text-sm text-muted-foreground
                    `}
                    data-testid="grammar-empty"
                  >
                    No grammar points match your search.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
