import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "@storybook/test";

import { SettingsPopover } from "./SettingsPopover";

import { ThemeProvider } from "@/context/ThemeProvider";

const meta = {
  component: SettingsPopover,
  decorators: [
    Story => (
      <ThemeProvider
        defaultTheme="light"
        storageKey="storybook-theme"
      >
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SettingsPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("settings-trigger");

    await expect(trigger).toBeInTheDocument();
  },
};

export const OpenPopover: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("settings-trigger");

    await userEvent.click(trigger);

    // Popover content renders in a portal outside canvasElement, so query the document body
    const body = within(document.body);
    await expect(body.getByRole("heading", {
      name: "Settings",
    })).toBeInTheDocument();
    await expect(body.getByText("Dark Mode")).toBeInTheDocument();
  },
};

export const DarkModeToggle: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const toggle = body.getByTestId("dark-mode-toggle");

    await expect(toggle).toHaveAttribute("role", "switch");
    await expect(toggle).toHaveAttribute("data-state", "unchecked");

    // Toggle dark mode on
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "checked");

    // Toggle dark mode off
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  },
};
