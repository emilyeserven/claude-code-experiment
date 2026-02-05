import type { ColumnDef, SortingState } from "@tanstack/react-table";

import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface TimerEntry {
  text: string;
  timestamp: string;
}

interface TimerEntriesTableProps {
  entries: TimerEntry[];
}

const columns: ColumnDef<TimerEntry>[] = [
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "timestamp",
    header: ({
      column,
    }) => {
      const sorted = column.getIsSorted();
      return (
        <button
          type="button"
          className="inline-flex w-full items-center justify-end gap-1"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Timestamp
          {sorted === "asc"
            ? <ArrowUp className="size-3.5" />
            : sorted === "desc"
              ? <ArrowDown className="size-3.5" />
              : <ArrowUpDown className="size-3.5 opacity-50" />}
        </button>
      );
    },
    enableSorting: true,
    meta: {
      className: "w-36 text-right",
    },
    cell: ({
      getValue,
    }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
];

export function TimerEntriesTable({
  entries,
}: TimerEntriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: entries,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={`
        w-full
        md:w-4/5
      `}
      data-testid="timer-entries-list"
    >
      <table className="w-full border-collapse">
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
                    (header.column.columnDef.meta as { className?: string })?.className,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0
            ? table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`
                  border-b
                  last:border-b-0
                  dark:border-gray-600
                `}
                data-testid="timer-entry"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-3 py-2",
                      (cell.column.columnDef.meta as { className?: string })?.className,
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
                  colSpan={columns.length}
                  className="px-3 py-6 text-center"
                  data-testid="timer-entries-empty"
                >
                  <p className="text-sm text-muted-foreground">
                    {"No entries yet. Start the timer, type in the input field, and press "}
                    <kbd className="rounded border px-1 py-0.5 text-xs">
                      Enter
                    </kbd>
                    {" or click "}
                    <strong>
                      Submit
                    </strong>
                    {" to add an entry."}
                  </p>
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}
