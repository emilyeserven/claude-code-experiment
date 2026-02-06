import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, within, expect, userEvent } from "@storybook/test";

import { SessionName } from "./SessionName";

const meta = {
  component: SessionName,
  args: {
    name: "My Session",
    onRename: fn(),
  },
} satisfies Meta<typeof SessionName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("session-name-text")).toHaveTextContent("My Session");
    await expect(canvas.getByTestId("session-name-edit-button")).toBeInTheDocument();
  },
};

export const EnterEditMode: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    await expect(canvas.getByTestId("session-name-input")).toBeInTheDocument();
    await expect(canvas.getByTestId("session-name-input")).toHaveValue("My Session");
    await expect(canvas.getByTestId("session-name-save")).toBeInTheDocument();
    await expect(canvas.getByTestId("session-name-cancel")).toBeInTheDocument();
  },
};

export const SaveRename: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    const input = canvas.getByTestId("session-name-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed Session");

    await userEvent.click(canvas.getByTestId("session-name-save"));

    await expect(args.onRename).toHaveBeenCalledWith("Renamed Session");
  },
};

export const CancelRename: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    args.onRename.mockClear();

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    const input = canvas.getByTestId("session-name-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Changed Name");

    await userEvent.click(canvas.getByTestId("session-name-cancel"));

    await expect(args.onRename).not.toHaveBeenCalled();
    await expect(canvas.getByTestId("session-name-text")).toHaveTextContent("My Session");
  },
};

export const SaveViaEnter: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    const input = canvas.getByTestId("session-name-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Enter Save{Enter}");

    await expect(args.onRename).toHaveBeenCalledWith("Enter Save");
  },
};

export const CancelViaEscape: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    args.onRename.mockClear();

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    const input = canvas.getByTestId("session-name-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Changed{Escape}");

    await expect(args.onRename).not.toHaveBeenCalled();
    await expect(canvas.getByTestId("session-name-text")).toHaveTextContent("My Session");
  },
};

export const EmptyNameNotSaved: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    args.onRename.mockClear();

    await userEvent.click(canvas.getByTestId("session-name-edit-button"));

    const input = canvas.getByTestId("session-name-input");
    await userEvent.clear(input);

    await userEvent.click(canvas.getByTestId("session-name-save"));

    await expect(args.onRename).not.toHaveBeenCalled();
    await expect(canvas.getByTestId("session-name-text")).toHaveTextContent("My Session");
  },
};
