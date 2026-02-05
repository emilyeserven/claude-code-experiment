import type { ColumnDef } from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
    header: "Timestamp",
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
  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="w-full max-w-md"
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
                  className={`
                    px-3 py-2 text-left text-sm font-medium
                    text-muted-foreground
                  `}
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
                    className="px-3 py-2"
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
