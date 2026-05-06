import type { GrammarPoint } from "../-data/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "@storybook/test";

import { GrammarTable } from "./GrammarTable";

const sampleGrammarPoints: GrammarPoint[] = [
  {
    level: "N5",
    number: 1,
    japanese: "ちゃいけない・じゃいけない",
    english: "must not do (spoken Japanese)",
  },
  {
    level: "N5",
    number: 2,
    japanese: "だ・です",
    english: "to be (am, is, are, were, used to)",
  },
  {
    level: "N5",
    number: 3,
    japanese: "だけ",
    english: "only; just; as much as",
  },
];

const meta = {
  component: GrammarTable,
  args: {
    grammarPoints: sampleGrammarPoints,
  },
} satisfies Meta<typeof GrammarTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("grammar-table")).toBeInTheDocument();
    await expect(canvas.getAllByTestId("grammar-row")).toHaveLength(3);
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("3 of 3");
  },
};

export const SearchFiltersByEnglish: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    await userEvent.type(search, "only");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(1);
    await expect(rows[0]).toHaveTextContent("だけ");
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("1 of 3");
  },
};

export const SearchFiltersByJapanese: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    await userEvent.type(search, "だ・です");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(1);
    await expect(rows[0]).toHaveTextContent("to be");
  },
};

export const SearchEmptyShowsAll: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    await userEvent.type(search, "xyzzy");
    await expect(canvas.getByTestId("grammar-empty")).toBeInTheDocument();

    await userEvent.clear(search);
    await expect(canvas.getAllByTestId("grammar-row")).toHaveLength(3);
  },
};
