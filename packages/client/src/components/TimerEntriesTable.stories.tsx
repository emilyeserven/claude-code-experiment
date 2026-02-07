import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, within, expect, userEvent } from "@storybook/test";

import { TimerEntriesTable } from "./TimerEntriesTable";

const sampleEntries = [
  {
    text: "First task",
    timestamp: "00:01:23.456",
  },
  {
    text: "Second task",
    timestamp: "00:05:10.200",
  },
  {
    text: "Third task",
    timestamp: "00:12:45.789",
  },
];

const meta = {
  component: TimerEntriesTable,
  args: {
    entries: sampleEntries,
    onDeleteEntry: fn(),
    onDeleteEntries: fn(),
  },
} satisfies Meta<typeof TimerEntriesTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    // Renders all entries
    const rows = canvas.getAllByTestId("timer-entry");
    await expect(rows).toHaveLength(3);
    await expect(rows[0]).toHaveTextContent("First task");
    await expect(rows[1]).toHaveTextContent("Second task");
    await expect(rows[2]).toHaveTextContent("Third task");

    // Renders a checkbox for each row
    const checkboxes = canvas.getAllByTestId("row-checkbox");
    await expect(checkboxes).toHaveLength(3);

    // No delete button when nothing is selected
    await expect(canvas.queryByTestId("delete-selected-button")).not.toBeInTheDocument();

    // Export as Markdown button should be visible
    await expect(canvas.getByTestId("export-markdown-button")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("timer-entries-empty")).toBeInTheDocument();
    await expect(canvas.queryAllByTestId("timer-entry")).toHaveLength(0);

    // Export button should not be visible when there are no entries
    await expect(canvas.queryByTestId("export-markdown-button")).not.toBeInTheDocument();
  },
};

export const WithSelection: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Click first checkbox to select a row
    await userEvent.click(checkboxes[0]);

    // Delete button should appear with correct singular text
    await expect(canvas.getByTestId("delete-selected-button")).toBeInTheDocument();
    await expect(canvas.getByTestId("delete-selected-button")).toHaveTextContent("Delete 1 Entry");

    // Selected row should have red background
    const rows = canvas.getAllByTestId("timer-entry");
    await expect(rows[0].className).toMatch(/bg-red/);
    await expect(rows[1].className).not.toMatch(/bg-red/);
    await expect(rows[2].className).not.toMatch(/bg-red/);
  },
};

export const WithMultipleSelection: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select two rows
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[2]);

    // Delete button should show correct plural count
    await expect(canvas.getByTestId("delete-selected-button")).toHaveTextContent("Delete 2 Entries");

    // Both selected rows should have red background, middle should not
    const rows = canvas.getAllByTestId("timer-entry");
    await expect(rows[0].className).toMatch(/bg-red/);
    await expect(rows[1].className).not.toMatch(/bg-red/);
    await expect(rows[2].className).toMatch(/bg-red/);
  },
};

export const Deselection: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select a row
    await userEvent.click(checkboxes[0]);
    await expect(canvas.getByTestId("delete-selected-button")).toBeInTheDocument();

    // Deselect the row
    await userEvent.click(checkboxes[0]);

    // Delete button should disappear
    await expect(canvas.queryByTestId("delete-selected-button")).not.toBeInTheDocument();
  },
};

export const ExportMarkdownDialog: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    // Click the export button
    await userEvent.click(canvas.getByTestId("export-markdown-button"));

    // Dialog should open with markdown content
    const body = within(document.body);
    const textarea = body.getByTestId("markdown-export-textarea") as HTMLTextAreaElement;
    await expect(textarea).toBeInTheDocument();
    await expect(textarea.value).toContain("| Text | Timestamp |");
    await expect(textarea.value).toContain("| First task | 00:01:23.456 |");
    await expect(textarea.value).toContain("| Second task | 00:05:10.200 |");
    await expect(textarea.value).toContain("| Third task | 00:12:45.789 |");

    // Copy button should be present
    await expect(body.getByTestId("copy-markdown-button")).toHaveTextContent("Copy to Clipboard");
  },
};

export const DeleteConfirmation: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select a row and click delete
    await userEvent.click(checkboxes[0]);
    await userEvent.click(canvas.getByTestId("delete-selected-button"));

    // Confirmation dialog should appear in portal
    const body = within(document.body);
    await expect(body.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    await expect(body.getByTestId("cancel-delete-button")).toBeInTheDocument();
    await expect(body.getByTestId("confirm-delete-button")).toBeInTheDocument();
  },
};

export const DeleteCancelled: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select a row and open delete dialog
    await userEvent.click(checkboxes[0]);
    await userEvent.click(canvas.getByTestId("delete-selected-button"));

    // Cancel the dialog
    const body = within(document.body);
    await userEvent.click(body.getByTestId("cancel-delete-button"));

    // onDeleteEntries should not have been called
    await expect(args.onDeleteEntries).not.toHaveBeenCalled();
  },
};

export const DeleteConfirmed: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select first and third rows
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[2]);

    // Open delete dialog and confirm
    await userEvent.click(canvas.getByTestId("delete-selected-button"));
    const body = within(document.body);
    await userEvent.click(body.getByTestId("confirm-delete-button"));

    // onDeleteEntries should have been called with the selected indices
    await expect(args.onDeleteEntries).toHaveBeenCalledTimes(1);

    // Selection should be cleared (delete button gone)
    await expect(canvas.queryByTestId("delete-selected-button")).not.toBeInTheDocument();
  },
};
