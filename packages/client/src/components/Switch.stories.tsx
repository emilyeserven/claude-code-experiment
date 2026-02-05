import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import { Switch } from "./Switch";

const meta = {
  component: Switch,
  args: {
    "data-testid": "switch",
    "onCheckedChange": fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toBeInTheDocument();
    await expect(switchEl).toHaveAttribute("data-state", "unchecked");

    // Renders the thumb element
    const thumb = switchEl.querySelector("[data-slot='switch-thumb']");
    await expect(thumb).toBeInTheDocument();
  },
};

export const Checked: Story = {
  args: {
    checked: true,
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
    disabled: true,
  },
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toBeDisabled();

    // Does not fire onCheckedChange when disabled
    await userEvent.click(switchEl);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const Clickable: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await userEvent.click(switchEl);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

export const ClickChecked: Story = {
  args: {
    checked: true,
  },
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await userEvent.click(switchEl);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "mt-4",
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("switch");

    await expect(switchEl).toHaveClass("mt-4");
  },
};
