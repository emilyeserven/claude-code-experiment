import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, screen, userEvent, within } from "@storybook/test";

import { QuizSettingsMenu } from "./QuizSettingsMenu";

const meta = {
  title: "Quizzes/Giving and Receiving/QuizSettingsMenu",
  component: QuizSettingsMenu,
  args: {
    mode: "mixed",
    onModeChange: fn(),
  },
} satisfies Meta<typeof QuizSettingsMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("quiz-settings-trigger")).toBeInTheDocument();
    await expect(screen.queryByTestId("quiz-mode-selector")).not.toBeInTheDocument();
  },
};

export const OpensPopover: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("quiz-settings-trigger"));
    const selector = await screen.findByTestId("quiz-mode-selector");
    await expect(selector).toBeInTheDocument();
    await expect(screen.getByTestId("mode-mixed")).toBeInTheDocument();
    await expect(screen.getByTestId("mode-fill-in-blank")).toBeInTheDocument();
    await expect(screen.getByTestId("mode-reveal-translation")).toBeInTheDocument();
    await expect(screen.getByTestId("mode-grammar-point-grid")).toBeInTheDocument();
  },
};

export const SelectingModeFiresCallback: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("quiz-settings-trigger"));
    await userEvent.click(await screen.findByTestId("mode-fill-in-blank"));
    await expect(args.onModeChange).toHaveBeenCalledWith("fill-in-blank");
  },
};
