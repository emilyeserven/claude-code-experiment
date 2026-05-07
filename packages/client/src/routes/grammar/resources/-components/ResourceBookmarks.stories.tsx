import type { BookmarkLocationGroup } from "./ResourceBookmarks";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, within } from "@storybook/test";

import { ResourceBookmarks } from "./ResourceBookmarks";

const sampleGroups: BookmarkLocationGroup[] = [
  {
    location: "1",
    grammarPoints: [
      {
        id: "N5-2",
        level: "N5",
        number: 2,
        japanese: "だ・です",
        romaji: "da / desu",
        english: "to be (am, is, are, were, used to)",
      },
      {
        id: "N5-21",
        level: "N5",
        number: 21,
        japanese: "か",
        romaji: "ka",
        english: "question particle",
      },
    ],
  },
  {
    location: "12",
    grammarPoints: [
      {
        id: "N5-4",
        level: "N5",
        number: 4,
        japanese: "だろう",
        romaji: "darou",
        english: "I think; it seems; probably; right?",
      },
    ],
  },
];

const meta = {
  component: ResourceBookmarks,
  args: {
    groups: sampleGroups,
  },
} satisfies Meta<typeof ResourceBookmarks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByTestId("resource-bookmark-group");
    await expect(groups).toHaveLength(2);

    const locations = canvas.getAllByTestId("resource-bookmark-location");
    await expect(locations[0]).toHaveTextContent("Location 1");
    await expect(locations[1]).toHaveTextContent("Location 12");

    const points = canvas.getAllByTestId("resource-bookmark-grammar-point");
    await expect(points).toHaveLength(3);
    await expect(points[0]).toHaveTextContent("だ・です");
    await expect(points[0]).toHaveTextContent("to be");
  },
};

export const Empty: Story = {
  args: {
    groups: [],
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("resource-bookmarks-empty")).toBeInTheDocument();
  },
};
