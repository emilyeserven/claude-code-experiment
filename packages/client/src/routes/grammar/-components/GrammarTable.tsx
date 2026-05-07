import type { BookmarkDisplay, GrammarRow } from "../-data/types";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface GrammarTableProps {
  rows: GrammarRow[];
}

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

function globalFilterFn(row: { original: GrammarRow }, _columnId: string, filterValue: string) {
  if (!filterValue) return true;
  const needle = filterValue.toLowerCase();
  const {
    level,
    number,
    japanese,
    english,
    bookmarks,
  } = row.original;
  if (level.toLowerCase().includes(needle)) return true;
  if (String(number).includes(needle)) return true;
  if (japanese.toLowerCase().includes(needle)) return true;
  if (english.toLowerCase().includes(needle)) return true;
  for (const b of bookmarks) {
    if (b.resourceName.toLowerCase().includes(needle)) return true;
    if (b.location.toLowerCase().includes(needle)) return true;
  }
  return false;
}

export function GrammarTable({
  rows,
}: GrammarTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useMemo(() => rows, [rows]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tableRows = table.getRowModel().rows;

  return (
    <div
      className="w-full"
      data-testid="grammar-table-root"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Input
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search grammar points..."
          className="max-w-sm"
          data-testid="grammar-search-input"
          aria-label="Search grammar points"
        />
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
