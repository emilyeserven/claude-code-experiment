import type { Sentence } from "../-utils/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import { RevealTranslation } from "./RevealTranslation";

const sampleSentence: Sentence = {
  id: "sb-kureru-001",
  grammarPoint: "kureru",
  japanese: "友達が私にプレゼントをくれた。",
  japaneseBlank: "友達が私にプレゼントを___。",
  acceptableAnswers: ["くれた", "くれました"],
  english: "My friend gave me a present.",
};

const meta = {
  title: "Quizzes/Giving and Receiving/RevealTranslation",
  component: RevealTranslation,
  args: {
    sentence: sampleSentence,
    onNext: fn(),
    onResult: fn(),
  },
} satisfies Meta<typeof RevealTranslation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("reveal-translation-japanese"))
      .toHaveTextContent("友達が私にプレゼントをくれた。");
    await expect(canvas.getByTestId("reveal-translation-button"))
      .toBeInTheDocument();
  },
};

export const RevealShowsEnglish: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("reveal-translation-button"));
    await expect(canvas.getByTestId("reveal-translation-english"))
      .toHaveTextContent("My friend gave me a present.");
  },
};

export const RatingThenNext: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("reveal-translation-button"));
    await userEvent.click(canvas.getByTestId("rating-good"));
    await expect(args.onResult).toHaveBeenCalledWith("good");
    await expect(canvas.getByTestId("reveal-translation-rated"))
      .toBeInTheDocument();
    await userEvent.click(canvas.getByTestId("reveal-translation-next"));
    await expect(args.onNext).toHaveBeenCalled();
  },
};
