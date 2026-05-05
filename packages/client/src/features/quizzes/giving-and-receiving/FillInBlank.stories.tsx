import type { Sentence } from "./types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import { FillInBlank } from "./FillInBlank";

const sampleSentence: Sentence = {
  id: "sb-ageru-001",
  grammarPoint: "ageru",
  japanese: "私は友達にプレゼントをあげた。",
  japaneseBlank: "私は友達にプレゼントを___。",
  acceptableAnswers: ["あげた", "あげました"],
  english: "I gave my friend a present.",
};

const meta = {
  component: FillInBlank,
  args: {
    sentence: sampleSentence,
    onNext: fn(),
    onResult: fn(),
  },
} satisfies Meta<typeof FillInBlank>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("fill-in-blank-english"))
      .toHaveTextContent("I gave my friend a present.");
    await expect(canvas.getByTestId("fill-in-blank-input")).toBeInTheDocument();
  },
};

export const ConvertsRomajiAsYouType: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("fill-in-blank-input");
    await userEvent.type(input, "ageta");
    await expect(canvas.getByTestId("fill-in-blank-display"))
      .toHaveTextContent("あげた");
  },
};

export const CorrectAnswer: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("fill-in-blank-input");
    await userEvent.type(input, "ageta");
    await userEvent.click(canvas.getByTestId("fill-in-blank-submit"));
    await expect(canvas.getByTestId("fill-in-blank-correct")).toBeInTheDocument();
    await expect(args.onResult).toHaveBeenCalledWith(true);
  },
};

export const IncorrectAnswerShowsTailoredFeedback: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("fill-in-blank-input");
    await userEvent.type(input, "kureta");
    await userEvent.click(canvas.getByTestId("fill-in-blank-submit"));
    await expect(canvas.getByTestId("fill-in-blank-incorrect")).toBeInTheDocument();
    await expect(canvas.getByTestId("fill-in-blank-failure-note"))
      .toBeInTheDocument();
    await expect(args.onResult).toHaveBeenCalledWith(false);
  },
};

export const SubmitDisabledWhenEmpty: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("fill-in-blank-submit")).toBeDisabled();
  },
};

export const NextResetsState: Story = {
  play: async ({
    canvasElement, args,
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("fill-in-blank-input");
    await userEvent.type(input, "ageta");
    await userEvent.click(canvas.getByTestId("fill-in-blank-submit"));
    await userEvent.click(canvas.getByTestId("fill-in-blank-next"));
    await expect(args.onNext).toHaveBeenCalled();
  },
};
