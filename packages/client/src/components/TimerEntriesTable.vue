<script setup lang="ts">
import type { ColumnDef, RowSelectionState, SortingState, VisibilityState } from "@tanstack/vue-table";

import { computed, ref, watch } from "vue";
import { getCoreRowModel, getSortedRowModel, useVueTable } from "@tanstack/vue-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Keyboard, ListChecks, Send, Trash2 } from "lucide-vue-next";

import ActionsCell from "@/components/ActionsCell.vue";
import Button from "@/components/Button.vue";
import Checkbox from "@/components/Checkbox.vue";
import Input from "@/components/Input.vue";
import Tooltip from "@/components/Tooltip.vue";
import TooltipTrigger from "@/components/TooltipTrigger.vue";
import TooltipContent from "@/components/TooltipContent.vue";
import AlertDialog from "@/components/dialogs/AlertDialog.vue";
import AlertDialogHeader from "@/components/dialogs/AlertDialogHeader.vue";
import AlertDialogFooter from "@/components/dialogs/AlertDialogFooter.vue";
import AlertDialogTitle from "@/components/dialogs/AlertDialogTitle.vue";
import AlertDialogDescription from "@/components/dialogs/AlertDialogDescription.vue";
import AlertDialogAction from "@/components/dialogs/AlertDialogAction.vue";
import AlertDialogCancel from "@/components/dialogs/AlertDialogCancel.vue";
import Dialog from "@/components/dialogs/Dialog.vue";
import DialogHeader from "@/components/dialogs/DialogHeader.vue";
import DialogFooter from "@/components/dialogs/DialogFooter.vue";
import DialogTitle from "@/components/dialogs/DialogTitle.vue";
import DialogDescription from "@/components/dialogs/DialogDescription.vue";
import { useIsMobile } from "@/composables/useIsMobile";
import { cn } from "@/lib/utils";

interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: "submit" | "typing-start";
}

const props = defineProps<{
  entries: TimerEntry[];
}>();

const emit = defineEmits<{
  editEntry: [index: number, entry: TimerEntry];
  deleteEntry: [index: number];
  deleteEntries: [indices: number[]];
}>();

const sorting = ref<SortingState>([]);
const rowSelection = ref<RowSelectionState>({});
const showDeleteDialog = ref(false);
const editingEntry = ref<{ index: number; entry: TimerEntry } | null>(null);
const editText = ref("");
const editTimestamp = ref("");
const multiselectEnabled = ref(false);
const isMobile = useIsMobile();

// Uniform mode detection
const entriesWithMode = computed(() => props.entries.filter(e => e.mode != null));
const hasMixedModes = computed(() => {
  const withMode = entriesWithMode.value;
  return withMode.length > 0 && !withMode.every(e => e.mode === withMode[0].mode);
});
const uniformMode = computed(() => {
  const withMode = entriesWithMode.value;
  return withMode.length > 0 && !hasMixedModes.value ? withMode[0].mode : null;
});

const columnVisibility = computed<VisibilityState>(() => ({
  select: !isMobile.value || multiselectEnabled.value,
  mode: hasMixedModes.value,
}));

// Clear selection when entries change
watch(() => props.entries, () => {
  rowSelection.value = {};
});

// Clear selection when switching to desktop
watch(isMobile, (mobile) => {
  if (!mobile) {
    multiselectEnabled.value = false;
    rowSelection.value = {};
  }
});

const columns: ColumnDef<TimerEntry>[] = [
  {
    id: "select",
    meta: { className: "w-10" },
    header: () => null,
    cell: () => null,
  },
  {
    id: "mode",
    meta: { className: "w-10" },
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    enableSorting: true,
    meta: { className: "w-36 text-right" },
  },
  {
    id: "actions",
    meta: { className: "w-10" },
    cell: () => null,
  },
];

const table = useVueTable({
  get data() { return props.entries; },
  columns,
  state: {
    get sorting() { return sorting.value; },
    get rowSelection() { return rowSelection.value; },
    get columnVisibility() { return columnVisibility.value; },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === "function" ? updater(rowSelection.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  enableRowSelection: true,
});

const selectedCount = computed(() => Object.keys(rowSelection.value).length);

function handleDeleteSelected() {
  const selectedIndices = table.getSelectedRowModel().rows.map(row => row.index);
  emit("deleteEntries", selectedIndices);
  rowSelection.value = {};
  showDeleteDialog.value = false;
}

function handleToggleMultiselect() {
  if (multiselectEnabled.value) {
    rowSelection.value = {};
  }
  multiselectEnabled.value = !multiselectEnabled.value;
}

function openEditDialog(index: number, entry: TimerEntry) {
  editingEntry.value = { index, entry };
  editText.value = entry.text;
  editTimestamp.value = entry.timestamp;
}

function handleEditSave() {
  if (editingEntry.value === null || !editText.value.trim()) return;
  emit("editEntry", editingEntry.value.index, {
    text: editText.value.trim(),
    timestamp: editTimestamp.value,
  });
  editingEntry.value = null;
}
</script>

<template>
  <div
    class="w-full md:w-4/5"
    data-testid="timer-entries-list"
  >
    <h2
      class="mb-1 text-lg font-semibold"
      data-testid="entries-header"
    >
      Entries
    </h2>
    <div
      class="mb-2 flex items-center gap-2"
      data-testid="entries-toolbar"
    >
      <Tooltip v-if="uniformMode !== null">
        <TooltipTrigger>
          <span
            class="inline-flex text-muted-foreground"
            data-testid="toolbar-mode-icon"
          >
            <Keyboard
              v-if="uniformMode === 'typing-start'"
              class="size-4"
            />
            <Send
              v-else
              class="size-4"
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {{ uniformMode === "typing-start" ? "All entries captured on typing start" : "All entries captured on submit" }}
        </TooltipContent>
      </Tooltip>
      <div class="ml-auto flex items-center gap-2">
        <Button
          v-if="isMobile && props.entries.length > 0"
          :variant="multiselectEnabled ? 'secondary' : 'outline'"
          size="sm"
          data-testid="toggle-multiselect-button"
          @click="handleToggleMultiselect"
        >
          <ListChecks class="size-4" />
          {{ multiselectEnabled ? "Cancel Multiselect" : "Enable Multiselect" }}
        </Button>
        <Button
          v-if="selectedCount > 0"
          variant="destructive"
          size="sm"
          data-testid="delete-selected-button"
          @click="showDeleteDialog = true"
        >
          <Trash2 class="size-4" />
          Delete {{ selectedCount }} {{ selectedCount === 1 ? "Entry" : "Entries" }}
        </Button>
      </div>
    </div>

    <table class="w-full border-collapse">
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="border-b dark:border-gray-600"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="cn(
              'px-3 py-2 text-left text-sm font-medium text-muted-foreground',
              header.column.getCanSort() && 'cursor-pointer select-none',
              (header.column.columnDef.meta as { className?: string })?.className,
            )"
          >
            <template v-if="!header.isPlaceholder">
              <template v-if="header.column.id === 'timestamp'">
                <button
                  type="button"
                  class="inline-flex w-full items-center justify-end gap-1"
                  @click="header.column.toggleSorting(header.column.getIsSorted() === 'asc')"
                >
                  Timestamp
                  <ArrowUp
                    v-if="header.column.getIsSorted() === 'asc'"
                    class="size-3.5"
                  />
                  <ArrowDown
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    class="size-3.5"
                  />
                  <ArrowUpDown
                    v-else
                    class="size-3.5 opacity-50"
                  />
                </button>
              </template>
              <template v-else-if="header.column.id === 'text'">
                Text
              </template>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="table.getRowModel().rows.length > 0">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :class="cn(
              'group/row border-b last:border-b-0 dark:border-gray-600',
              row.getIsSelected() && 'bg-red-50 dark:bg-red-950/30',
            )"
            data-testid="timer-entry"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="cn(
                'px-3 py-2',
                (cell.column.columnDef.meta as { className?: string })?.className,
              )"
            >
              <!-- Select column -->
              <template v-if="cell.column.id === 'select'">
                <Checkbox
                  :checked="row.getIsSelected()"
                  aria-label="Select row"
                  data-testid="row-checkbox"
                  :class="cn(
                    'transition-opacity',
                    !isMobile && !row.getIsSelected() && 'opacity-0 group-hover/row:opacity-100',
                  )"
                  @update:checked="row.toggleSelected(!!$event)"
                />
              </template>
              <!-- Mode column -->
              <template v-else-if="cell.column.id === 'mode'">
                <Tooltip v-if="row.original.mode">
                  <TooltipTrigger>
                    <span
                      class="inline-flex text-muted-foreground"
                      data-testid="entry-mode-icon"
                    >
                      <Keyboard
                        v-if="row.original.mode === 'typing-start'"
                        class="size-4"
                      />
                      <Send
                        v-else
                        class="size-4"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {{ row.original.mode === "typing-start" ? "Timestamp captured on typing start" : "Timestamp captured on submit" }}
                  </TooltipContent>
                </Tooltip>
              </template>
              <!-- Text column -->
              <template v-else-if="cell.column.id === 'text'">
                {{ row.original.text }}
              </template>
              <!-- Timestamp column -->
              <template v-else-if="cell.column.id === 'timestamp'">
                <span class="font-mono text-sm text-muted-foreground">
                  {{ row.original.timestamp }}
                </span>
              </template>
              <!-- Actions column -->
              <template v-else-if="cell.column.id === 'actions'">
                <ActionsCell
                  :row="row"
                  @edit="openEditDialog(row.index, row.original)"
                  @delete="emit('deleteEntry', row.index)"
                />
              </template>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td
            :colspan="table.getVisibleLeafColumns().length"
            class="px-3 py-6 text-center"
            data-testid="timer-entries-empty"
          >
            <p class="text-sm text-muted-foreground">
              No entries yet. Start the timer, type in the input field, and press
              <kbd class="rounded border px-1 py-0.5 text-xs">Enter</kbd>
              or click <strong>Submit</strong> to add an entry.
            </p>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bulk Delete Dialog -->
    <AlertDialog
      :open="showDeleteDialog"
      @update:open="showDeleteDialog = $event"
    >
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete {{ selectedCount }} {{ selectedCount === 1 ? "Entry" : "Entries" }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete the selected {{ selectedCount === 1 ? "entry" : "entries" }}? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel data-testid="cancel-delete-button">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          data-testid="confirm-delete-button"
          @click="handleDeleteSelected"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>

    <!-- Edit Entry Dialog -->
    <Dialog
      :open="editingEntry !== null"
      @update:open="!$event && (editingEntry = null)"
    >
      <DialogHeader>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogDescription>Modify the text and timestamp for this entry.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-2">
        <div class="grid gap-2">
          <label
            for="edit-entry-text"
            class="text-sm font-medium"
          >Text</label>
          <Input
            id="edit-entry-text"
            v-model="editText"
            data-testid="edit-entry-text-input"
            @keydown="$event.key === 'Enter' && handleEditSave()"
          />
        </div>
        <div class="grid gap-2">
          <label
            for="edit-entry-timestamp"
            class="text-sm font-medium"
          >Timestamp</label>
          <Input
            id="edit-entry-timestamp"
            v-model="editTimestamp"
            data-testid="edit-entry-timestamp-input"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          data-testid="cancel-edit-button"
          @click="editingEntry = null"
        >
          Cancel
        </Button>
        <Button
          data-testid="save-edit-button"
          @click="handleEditSave"
        >
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  </div>
</template>
