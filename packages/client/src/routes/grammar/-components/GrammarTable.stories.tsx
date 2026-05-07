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
    romaji: "cha ikenai / ja ikenai",
    english: "must not do (spoken Japanese)",
    bookmarks: [],
  },
  {
    id: "N5-2",
    level: "N5",
    number: 2,
    japanese: "だ・です",
    romaji: "da / desu",
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
    romaji: "kara",
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
  {
    id: "N4-1",
    level: "N4",
    number: 1,
    japanese: "ば",
    romaji: "ba",
    english: "if; conditional",
    bookmarks: [],
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
    await expect(canvas.getAllByTestId("grammar-row")).toHaveLength(4);
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("4 of 4");
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
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("1 of 4");
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

export const SearchFiltersByRomajiDirect: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    await userEvent.type(search, "kara");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(1);
    await expect(rows[0]).toHaveTextContent("から");
  },
};

export const SearchFiltersByRomajiHiraganaConversion: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("grammar-search-input");

    // Typing romaji should match grammar points whose Japanese converts to.
    // "desu" → "です" matches "だ・です"
    await userEvent.type(search, "desu");

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows.length).toBeGreaterThanOrEqual(1);
    await expect(rows[0]).toHaveTextContent("だ・です");
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
    await expect(canvas.getAllByTestId("grammar-row")).toHaveLength(4);
  },
};

export const BookmarksRender: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    const bookmarkCells = canvas.getAllByTestId("grammar-bookmarks");
    await expect(bookmarkCells).toHaveLength(4);

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
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("2 of 4");
  },
};

export const FilterByLevelMultiSelect: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("grammar-filter-trigger"));

    // Filter content lives in a portal, so search the document root.
    const filterRoot = within(document.body);
    await userEvent.click(await filterRoot.findByTestId("grammar-filter-level-N5"));

    let rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(3);

    await userEvent.click(filterRoot.getByTestId("grammar-filter-level-N4"));

    rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(4);

    await expect(canvas.getByTestId("grammar-filter-badge")).toHaveTextContent("1");
  },
};

export const FilterByBookmarksWith: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("grammar-filter-trigger"));

    const filterRoot = within(document.body);
    await userEvent.click(await filterRoot.findByTestId("grammar-filter-bookmarks-with"));

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(2);
    await expect(canvas.getByTestId("grammar-results-count")).toHaveTextContent("2 of 4");
  },
};

export const FilterByBookmarksWithout: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("grammar-filter-trigger"));

    const filterRoot = within(document.body);
    await userEvent.click(await filterRoot.findByTestId("grammar-filter-bookmarks-without"));

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(2);
  },
};

export const ClearFilters: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId("grammar-filter-trigger"));

    const filterRoot = within(document.body);
    await userEvent.click(await filterRoot.findByTestId("grammar-filter-level-N5"));
    await userEvent.click(filterRoot.getByTestId("grammar-filter-bookmarks-with"));

    await userEvent.click(filterRoot.getByTestId("grammar-filter-clear"));

    const rows = canvas.getAllByTestId("grammar-row");
    await expect(rows).toHaveLength(4);
  },
};
