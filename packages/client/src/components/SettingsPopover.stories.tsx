import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, waitFor, within } from "@storybook/test";

import { SettingsPopover } from "./SettingsPopover";

import { SessionProvider } from "@/context/SessionProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { TimestampSettingsProvider } from "@/context/TimestampSettingsProvider";

const meta = {
  component: SettingsPopover,
  decorators: [
    Story => (
      <ThemeProvider
        defaultTheme="light"
        storageKey="storybook-theme"
      >
        <TimestampSettingsProvider>
          <SessionProvider>
            <Story />
          </SessionProvider>
        </TimestampSettingsProvider>
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

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    // Popover content renders in a portal outside canvasElement, so query the document body
    const body = within(document.body);
    await expect(body.getByRole("heading", {
      name: "Settings",
    })).toBeInTheDocument();
    await expect(body.getByText("Dark Mode")).toBeInTheDocument();

    // The toggle should be a switch element
    const toggle = body.getByTestId("dark-mode-toggle");
    await expect(toggle).toHaveAttribute("role", "switch");

    // Timestamp mode toggle should be visible
    await expect(body.getByText("Timestamp on Typing Start")).toBeInTheDocument();
    const timestampToggle = body.getByTestId("timestamp-mode-toggle");
    await expect(timestampToggle).toHaveAttribute("role", "switch");

    // Session switcher button should be visible
    await expect(body.getByTestId("switch-session-trigger")).toBeInTheDocument();
    await expect(body.getByTestId("switch-session-trigger")).toHaveTextContent("Switch Session");
  },
};

export const SwitchUncheckedInLightMode: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const toggle = body.getByTestId("dark-mode-toggle");

    await expect(toggle).toHaveAttribute("data-state", "unchecked");
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

    await expect(toggle).toHaveAttribute("data-state", "unchecked");

    // Toggle dark mode on
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "checked");

    // Toggle dark mode off
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  },
};

export const SunAndMoonIcons: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const toggle = body.getByTestId("dark-mode-toggle");

    // The switch track should contain both sun and moon SVG icons
    const svgs = toggle.querySelectorAll(":scope > svg");
    await expect(svgs.length).toBe(2);
  },
};

export const ResetLocalStorageButton: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const resetButton = body.getByTestId("reset-localstorage-trigger");
    await expect(resetButton).toBeInTheDocument();
    await expect(resetButton).toHaveTextContent("Reset Local Storage");
  },
};

export const ResetLocalStorageDialog: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    await userEvent.click(body.getByTestId("reset-localstorage-trigger"));

    await expect(body.getByText("Reset Local Storage?")).toBeInTheDocument();
    await expect(body.getByText(/This will clear all locally saved data/)).toBeInTheDocument();
    await expect(body.getByTestId("reset-localstorage-cancel")).toBeInTheDocument();
    await expect(body.getByTestId("reset-localstorage-confirm")).toBeInTheDocument();
  },
};

export const ResetLocalStorageCancelCloses: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    await userEvent.click(body.getByTestId("reset-localstorage-trigger"));

    await expect(body.getByText("Reset Local Storage?")).toBeInTheDocument();

    await userEvent.click(body.getByTestId("reset-localstorage-cancel"));

    // After cancelling, wait for the close animation to finish
    await waitFor(() => {
      expect(body.queryByText("Reset Local Storage?")).not.toBeInTheDocument();
    });
  },
};

export const TimestampModeToggle: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const toggle = body.getByTestId("timestamp-mode-toggle");

    await expect(toggle).toHaveAttribute("role", "switch");
    await expect(toggle).toHaveAttribute("data-state", "unchecked");

    // Toggle to typing-start mode
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "checked");

    // Toggle back to submit mode
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
  },
};

export const DarkModeDefault: Story = {
  decorators: [
    Story => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme-dark"
      >
        <TimestampSettingsProvider>
          <SessionProvider>
            <Story />
          </SessionProvider>
        </TimestampSettingsProvider>
      </ThemeProvider>
    ),
  ],
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("settings-trigger"));

    const body = within(document.body);
    const toggle = body.getByTestId("dark-mode-toggle");

    await expect(toggle).toHaveAttribute("data-state", "checked");
  },
};
