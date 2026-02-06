import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, within, expect, userEvent } from "@storybook/test";

import { SessionSwitcherDialog } from "./SessionSwitcherDialog";

const sampleSessions = [
  {
    id: "session-1",
    name: "Morning Tasks",
    entries: [
      {
        text: "Task 1",
        timestamp: "00:01:00.000",
      },
      {
        text: "Task 2",
        timestamp: "00:02:00.000",
      },
    ],
  },
  {
    id: "session-2",
    name: "Afternoon Tasks",
    entries: [
      {
        text: "Task 3",
        timestamp: "00:05:00.000",
      },
    ],
  },
  {
    id: "session-3",
    name: "Empty Session",
    entries: [],
  },
];

const meta = {
  component: SessionSwitcherDialog,
  args: {
    open: true,
    onOpenChange: fn(),
    sessions: sampleSessions,
    activeSessionId: "session-1",
    onSwitchSession: fn(),
    onCreateSession: fn(),
  },
} satisfies Meta<typeof SessionSwitcherDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    const body = within(document.body);

    await expect(body.getByText("Switch Session")).toBeInTheDocument();
    await expect(body.getByText("Select a session or create a new one.")).toBeInTheDocument();

    const items = body.getAllByTestId("session-list-item");
    await expect(items).toHaveLength(3);

    await expect(items[0]).toHaveTextContent("Morning Tasks");
    await expect(items[0]).toHaveTextContent("2 entries");
    await expect(items[1]).toHaveTextContent("Afternoon Tasks");
    await expect(items[1]).toHaveTextContent("1 entry");
    await expect(items[2]).toHaveTextContent("Empty Session");
    await expect(items[2]).toHaveTextContent("0 entries");

    await expect(body.getByTestId("new-session-button")).toBeInTheDocument();
  },
};

export const SelectSession: Story = {
  play: async ({
    args,
  }) => {
    const body = within(document.body);

    const items = body.getAllByTestId("session-list-item");
    await userEvent.click(items[1]);

    await expect(args.onSwitchSession).toHaveBeenCalledWith("session-2");
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

export const NewSessionFlow: Story = {
  play: async () => {
    const body = within(document.body);

    await userEvent.click(body.getByTestId("new-session-button"));

    await expect(body.getByTestId("new-session-name-input")).toBeInTheDocument();
    await expect(body.getByTestId("confirm-create-session")).toBeInTheDocument();
    await expect(body.getByTestId("cancel-create-session")).toBeInTheDocument();
  },
};

export const CreateNewSession: Story = {
  play: async ({
    args,
  }) => {
    const body = within(document.body);

    await userEvent.click(body.getByTestId("new-session-button"));

    const input = body.getByTestId("new-session-name-input");
    await userEvent.type(input, "New Session Name");

    await userEvent.click(body.getByTestId("confirm-create-session"));

    await expect(args.onCreateSession).toHaveBeenCalledWith("New Session Name");
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

export const CancelNewSession: Story = {
  play: async () => {
    const body = within(document.body);

    await userEvent.click(body.getByTestId("new-session-button"));

    const input = body.getByTestId("new-session-name-input");
    await userEvent.type(input, "Some Name");

    await userEvent.click(body.getByTestId("cancel-create-session"));

    // Should show the new session button again
    await expect(body.getByTestId("new-session-button")).toBeInTheDocument();
  },
};
