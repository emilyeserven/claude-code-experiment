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
    const rows = canvas.getAllByTestId("timer-entry");

    await expect(rows).toHaveLength(3);
    await expect(rows[0]).toHaveTextContent("First task");
    await expect(rows[1]).toHaveTextContent("Second task");
    await expect(rows[2]).toHaveTextContent("Third task");
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

    // Delete button should appear
    await expect(canvas.getByTestId("delete-selected-button")).toBeInTheDocument();
    await expect(canvas.getByTestId("delete-selected-button")).toHaveTextContent("Delete 1 Entry");
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

    // Delete button should show correct count
    await expect(canvas.getByTestId("delete-selected-button")).toHaveTextContent("Delete 2 Entries");
  },
};

export const DeleteConfirmation: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByTestId("row-checkbox");

    // Select a row
    await userEvent.click(checkboxes[0]);

    // Click delete button
    await userEvent.click(canvas.getByTestId("delete-selected-button"));

    // Confirmation dialog should appear in portal
    const body = within(document.body);
    await expect(body.getByText("Delete 1 Entry")).toBeInTheDocument();
    await expect(body.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    await expect(body.getByTestId("cancel-delete-button")).toBeInTheDocument();
    await expect(body.getByTestId("confirm-delete-button")).toBeInTheDocument();
  },
};
