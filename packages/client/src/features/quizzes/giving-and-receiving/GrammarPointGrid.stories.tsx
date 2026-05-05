import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import type { Sentence } from "./types";

import { GrammarPointGrid } from "./GrammarPointGrid";

const sampleSentence: Sentence = {
  id: "sb-te-morau-001",
  grammarPoint: "te-morau",
  japanese: "私は美容師に髪を切ってもらった。",
  japaneseBlank: "私は美容師に髪を切って___。",
  acceptableAnswers: ["もらった", "もらいました"],
  english: "I had the hairdresser cut my hair.",
};

const meta = {
  component: GrammarPointGrid,
  args: {
    sentence: sampleSentence,
    onNext: fn(),
    onResult: fn(),
    shuffleSeed: 42,
  },
} satisfies Meta<typeof GrammarPointGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("grammar-point-grid-english"))
      .toHaveTextContent("I had the hairdresser cut my hair.");
    await expect(canvas.getByTestId("grammar-point-grid-option-ageru"))
      .toBeInTheDocument();
    await expect(canvas.getByTestId("grammar-point-grid-option-te-morau"))
      .toBeInTheDocument();
  },
};

export const CorrectAnswer: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("grammar-point-grid-option-te-morau"));
    await expect(args.onResult).toHaveBeenCalledWith(true);
    await expect(canvas.getByTestId("grammar-point-grid-feedback"))
      .toHaveTextContent("Correct!");
  },
};

export const WrongAnswerShowsTailoredFeedback: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("grammar-point-grid-option-te-kureru"));
    await expect(args.onResult).toHaveBeenCalledWith(false);
    const tailored = canvas.getByTestId("grammar-point-grid-tailored");
    await expect(tailored).toBeInTheDocument();
    await expect(tailored.textContent).toMatch(/てくれる|くれる/);
  },
};

export const SecondClickIgnored: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("grammar-point-grid-option-ageru"));
    await userEvent.click(canvas.getByTestId("grammar-point-grid-option-te-morau"));
    await expect(args.onResult).toHaveBeenCalledTimes(1);
  },
};
