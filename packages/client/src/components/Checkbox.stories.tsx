import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { within, expect, userEvent } from "@storybook/test";

import { Checkbox } from "./Checkbox";

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toBeInTheDocument();
    await expect(checkbox).toHaveAttribute("data-state", "unchecked");
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toHaveAttribute("data-state", "checked");
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toBeDisabled();
  },
};

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={value => setChecked(!!value)}
        data-testid="controlled-checkbox"
      />
      <span data-testid="checkbox-state">
        {checked ? "Checked" : "Unchecked"}
      </span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledCheckbox />,
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByTestId("controlled-checkbox");
    const label = canvas.getByTestId("checkbox-state");

    await expect(label).toHaveTextContent("Unchecked");

    await userEvent.click(checkbox);
    await expect(label).toHaveTextContent("Checked");

    await userEvent.click(checkbox);
    await expect(label).toHaveTextContent("Unchecked");
  },
};
