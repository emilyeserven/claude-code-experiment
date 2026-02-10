import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, within, expect, userEvent, waitFor } from "@storybook/test";

import { TimerEntriesTable } from "./TimerEntriesTable";

const sampleEntries = [
  {
    text: "First task",
    timestamp: "00:01:23.456",
    mode: "submit" as const,
  },
  {
    text: "Second task",
    timestamp: "00:05:10.200",
    mode: "typing-start" as const,
  },
  {
    text: "Third task",
    timestamp: "00:12:45.789",
    mode: "submit" as const,
  },
];

const uniformModeEntries = [
  {
    text: "First task",
    timestamp: "00:01:23.456",
    mode: "submit" as const,
  },
  {
    text: "Second task",
    timestamp: "00:05:10.200",
    mode: "submit" as const,
  },
  {
    text: "Third task",
    timestamp: "00:12:45.789",
    mode: "submit" as const,
  },
];

const meta = {
  component: TimerEntriesTable,
  args: {
    entries: sampleEntries,
    onEditEntry: fn(),
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

    // Renders Entries header
    await expect(canvas.getByTestId("entries-header")).toHaveTextContent("Entries");

    // Renders toolbar
    await expect(canvas.getByTestId("entries-toolbar")).toBeInTheDocument();

    // Mixed modes: no toolbar mode icon, mode icons appear in rows
    await expect(canvas.queryByTestId("toolbar-mode-icon")).not.toBeInTheDocument();
    const modeIcons = canvas.getAllByTestId("entry-mode-icon");
    await expect(modeIcons.length).toBeGreaterThan(0);

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

export const EditEntryOpensDialog: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const triggers = canvas.getAllByTestId("entry-actions-trigger");

    // Open the context menu for the first row
    await userEvent.click(triggers[0]);

    // Edit button should be visible
    const body = within(document.body);
    await expect(body.getByTestId("edit-entry-button")).toBeInTheDocument();

    // Click edit
    await userEvent.click(body.getByTestId("edit-entry-button"));

    // Edit dialog should appear with pre-filled values
    await expect(body.getByTestId("edit-entry-text-input")).toBeInTheDocument();
    await expect(body.getByTestId("edit-entry-timestamp-input")).toBeInTheDocument();
    await expect(body.getByTestId("edit-entry-text-input")).toHaveValue("First task");
    await expect(body.getByTestId("edit-entry-timestamp-input")).toHaveValue("00:01:23.456");
  },
};

export const EditEntrySave: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const triggers = canvas.getAllByTestId("entry-actions-trigger");

    // Open context menu and click edit
    await userEvent.click(triggers[0]);
    const body = within(document.body);
    await userEvent.click(body.getByTestId("edit-entry-button"));

    // Clear and type new text
    const textInput = body.getByTestId("edit-entry-text-input");
    await userEvent.clear(textInput);
    await userEvent.type(textInput, "Updated task");

    // Click save
    await userEvent.click(body.getByTestId("save-edit-button"));

    // onEditEntry should have been called with updated values
    await expect(args.onEditEntry).toHaveBeenCalledTimes(1);
  },
};

export const EditEntryCancelled: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const triggers = canvas.getAllByTestId("entry-actions-trigger");

    // Open context menu and click edit
    await userEvent.click(triggers[0]);
    const body = within(document.body);
    await userEvent.click(body.getByTestId("edit-entry-button"));

    // Record call count before cancel
    const callsBefore = (args.onEditEntry as ReturnType<typeof fn>).mock.calls.length;

    // Click cancel
    await userEvent.click(body.getByTestId("cancel-edit-button"));

    // onEditEntry should not have been called again
    await expect(args.onEditEntry).toHaveBeenCalledTimes(callsBefore);

    // Dialog should be closed (wait for exit animation)
    await waitFor(() => expect(body.queryByTestId("edit-entry-text-input")).not.toBeInTheDocument());
  },
};

export const UniformMode: Story = {
  args: {
    entries: uniformModeEntries,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    // Uniform mode: toolbar shows mode icon, no per-row mode icons
    await expect(canvas.getByTestId("toolbar-mode-icon")).toBeInTheDocument();
    await expect(canvas.queryAllByTestId("entry-mode-icon")).toHaveLength(0);

    // Entries header and toolbar are present
    await expect(canvas.getByTestId("entries-header")).toHaveTextContent("Entries");
    await expect(canvas.getByTestId("entries-toolbar")).toBeInTheDocument();
  },
};
