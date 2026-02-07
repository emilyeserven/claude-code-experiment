import type { ColumnDef, Row, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";

import { useEffect, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ClipboardCopy, EllipsisVertical, ListChecks, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { MarkdownExportDialog } from "@/components/MarkdownExportDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

interface TimerEntry {
  text: string;
  timestamp: string;
}

interface TimerEntriesTableProps {
  entries: TimerEntry[];
  onDeleteEntry: (index: number) => void;
  onDeleteEntries: (indices: number[]) => void;
}

interface TableMeta {
  onDeleteEntry: (index: number) => void;
  isMobile: boolean;
}

function ActionsCell({
  row, onDeleteEntry,
}: { row: Row<TimerEntry>;
  onDeleteEntry: (index: number) => void; }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          data-testid="entry-actions-trigger"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-40 p-1"
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive"
          onClick={() => {
            setOpen(false);
            onDeleteEntry(row.index);
          }}
          data-testid="delete-entry-button"
        >
          Delete Entry
        </Button>
      </PopoverContent>
    </Popover>
  );
}

const columns: ColumnDef<TimerEntry>[] = [
  {
    id: "select",
    meta: {
      className: "w-10",
    },
    header: () => null,
    cell: ({
      row,
      table,
    }) => {
      const {
        isMobile,
      } = table.options.meta as TableMeta;
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          data-testid="row-checkbox"
          className={cn(
            "transition-opacity",
            !isMobile && !row.getIsSelected() && `
              opacity-0
              group-hover/row:opacity-100
            `,
          )}
        />
      );
    },
  },
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
  {
    id: "actions",
    meta: {
      className: "w-10",
    },
    cell: ({
      row,
      table,
    }) => {
      const {
        onDeleteEntry,
      } = table.options.meta as TableMeta;
      return (
        <ActionsCell
          row={row}
          onDeleteEntry={onDeleteEntry}
        />
      );
    },
  },
];

export function TimerEntriesTable({
  entries,
  onDeleteEntry,
  onDeleteEntries,
}: TimerEntriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMarkdownDialog, setShowMarkdownDialog] = useState(false);
  const [multiselectEnabled, setMultiselectEnabled] = useState(false);
  const isMobile = useIsMobile();

  const columnVisibility: VisibilityState = {
    select: !isMobile || multiselectEnabled,
  };

  // Clear selection when entries change (e.g. individual row deletion shifts indices)
  useEffect(() => {
    setRowSelection({});
  }, [entries]);

  // Clear selection and disable multiselect when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMultiselectEnabled(false);
      setRowSelection({});
    }
  }, [isMobile]);

  const table = useReactTable({
    data: entries,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    meta: {
      onDeleteEntry,
      isMobile,
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleDeleteSelected = () => {
    const selectedIndices = table
      .getSelectedRowModel()
      .rows.map(row => row.index);
    onDeleteEntries(selectedIndices);
    setRowSelection({});
    setShowDeleteDialog(false);
  };

  const handleToggleMultiselect = () => {
    if (multiselectEnabled) {
      setRowSelection({});
    }
    setMultiselectEnabled(prev => !prev);
  };

  return (
    <div
      className={`
        w-full
        md:w-4/5
      `}
      data-testid="timer-entries-list"
    >
      <div className="mb-2 flex items-center justify-end gap-2">
        {isMobile && entries.length > 0 && (
          <Button
            variant={multiselectEnabled ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleMultiselect}
            data-testid="toggle-multiselect-button"
          >
            <ListChecks className="size-4" />
            {multiselectEnabled ? "Cancel Multiselect" : "Enable Multiselect"}
          </Button>
        )}
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            data-testid="delete-selected-button"
          >
            <Trash2 className="size-4" />
            Delete
            {" "}
            {selectedCount}
            {" "}
            {selectedCount === 1 ? "Entry" : "Entries"}
          </Button>
        )}
      </div>

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
                className={cn(
                  `
                    group/row border-b
                    last:border-b-0
                    dark:border-gray-600
                  `,
                  row.getIsSelected() && `
                    bg-red-50
                    dark:bg-red-950/30
                  `,
                )}
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
                  colSpan={table.getVisibleLeafColumns().length}
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

      {entries.length > 0 && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMarkdownDialog(true)}
            data-testid="export-markdown-button"
          >
            <ClipboardCopy className="size-4" />
            Export as Markdown
          </Button>
        </div>
      )}

      <MarkdownExportDialog
        open={showMarkdownDialog}
        onOpenChange={setShowMarkdownDialog}
        entries={entries}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete
              {" "}
              {selectedCount}
              {" "}
              {selectedCount === 1 ? "Entry" : "Entries"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected
              {" "}
              {selectedCount === 1 ? "entry" : "entries"}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSelected}
              data-testid="confirm-delete-button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
