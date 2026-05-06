import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, within } from "@storybook/test";

import { GivingReceivingQuiz } from "./GivingReceivingQuiz";

const meta = {
  title: "Quizzes/Giving and Receiving/GivingReceivingQuiz",
  component: GivingReceivingQuiz,
} satisfies Meta<typeof GivingReceivingQuiz>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("giving-receiving-quiz")).toBeInTheDocument();
    await expect(canvas.getByTestId("quiz-settings-trigger")).toBeInTheDocument();
    await expect(canvas.getByTestId("quiz-score")).toHaveTextContent("Score: 0 / 0");
  },
};
