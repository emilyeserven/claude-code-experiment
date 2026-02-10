import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, within, expect, userEvent } from "@storybook/test";

import { SessionSettingsMenu } from "./SessionSettingsMenu";

const sampleEntries = [
  {
    text: "First entry",
    timestamp: "00:01:23",
    mode: "submit" as const,
  },
  {
    text: "Second entry",
    timestamp: "00:02:45",
    mode: "typing-start" as const,
  },
];

const meta = {
  component: SessionSettingsMenu,
  args: {
    sessionName: "My Session",
    entries: sampleEntries,
    onDeleteSession: fn(),
  },
} satisfies Meta<typeof SessionSettingsMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("session-settings-trigger")).toBeInTheDocument();
  },
};

export const OpenMenu: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-settings-trigger"));

    const body = within(document.body);
    await expect(body.getByTestId("export-markdown-button")).toBeInTheDocument();
    await expect(body.getByTestId("delete-session-button")).toBeInTheDocument();
  },
};

export const ExportMarkdownDisabledWhenNoEntries: Story = {
  args: {
    entries: [],
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-settings-trigger"));

    const body = within(document.body);
    await expect(body.getByTestId("export-markdown-button")).toBeDisabled();
  },
};

export const OpenDeleteSessionDialog: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-settings-trigger"));

    const body = within(document.body);
    await userEvent.click(body.getByTestId("delete-session-button"));

    await expect(body.getByTestId("cancel-delete-session")).toBeInTheDocument();
    await expect(body.getByTestId("confirm-delete-session")).toBeInTheDocument();
  },
};

export const CancelDeleteSession: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-settings-trigger"));

    const body = within(document.body);
    await userEvent.click(body.getByTestId("delete-session-button"));
    await userEvent.click(body.getByTestId("cancel-delete-session"));

    await expect(args.onDeleteSession).not.toHaveBeenCalled();
  },
};

export const ConfirmDeleteSession: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-settings-trigger"));

    const body = within(document.body);
    await userEvent.click(body.getByTestId("delete-session-button"));
    await userEvent.click(body.getByTestId("confirm-delete-session"));

    await expect(args.onDeleteSession).toHaveBeenCalledOnce();
  },
};
