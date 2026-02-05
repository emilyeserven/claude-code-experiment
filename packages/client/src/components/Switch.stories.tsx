import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import { Switch } from "./Switch";

const meta = {
  component: Switch,
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    "data-testid": "switch",
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toBeInTheDocument();
    await expect(switchEl).toHaveAttribute("data-state", "unchecked");
  },
};

export const Checked: Story = {
  args: {
    "data-testid": "switch",
    "checked": true,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toHaveAttribute("data-state", "checked");
  },
};

export const Disabled: Story = {
  args: {
    "data-testid": "switch",
    "disabled": true,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toBeDisabled();
  },
};

export const Clickable: Story = {
  args: {
    "data-testid": "switch",
  },
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await userEvent.click(switchEl);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
