import type { GrammarRow } from "../-data/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "@storybook/test";

import { GrammarTable } from "./GrammarTable";

const sampleRows: GrammarRow[] = [
  {
    id: "N5-1",
    level: "N5",
    number: 1,
    japanese: "ちゃいけない・じゃいけない",
    english: "must not do (spoken Japanese)",
    bookmarks: [],
  },
  {
    id: "N5-2",
    level: "N5",
    number: 2,
    japanese: "だ・です",
    english: "to be (am, is, are, were, used to)",
    bookmarks: [
      {
        resourceName: "Genki I & II",
        location: "1",
      },
    ],
  },
  {
    id: "N5-23",
    level: "N5",
    number: 23,
    japanese: "から",
    english: "because; since; from",
    bookmarks: [
      {
        resourceName: "Genki I & II",
        location: "6",
      },
      {
        resourceName: "Genki I & II",
        location: "9",
      },
    ],
  },
];

const meta = {
  component: GrammarTable,
  args: {
    rows: sampleRows,
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

    await userEvent.type(search, "because");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(1);
    await expect(rows[0]).toHaveTextContent("から");
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

export const BookmarksRender: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    const bookmarkCells = canvas.getAllByTestId("grammar-bookmarks");
    await expect(bookmarkCells).toHaveLength(3);

    await expect(bookmarkCells[0]).toHaveTextContent("");
    await expect(bookmarkCells[1]).toHaveTextContent("Genki I & II: 1");
    await expect(bookmarkCells[2]).toHaveTextContent("Genki I & II: 6, 9");
  },
};

export const SearchFiltersByBookmark: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    await userEvent.type(search, "genki");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(2);
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("2 of 3");
  },
};
