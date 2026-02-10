import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "@storybook/test";

import { MarkdownExportDialog } from "./MarkdownExportDialog";

const sampleEntries = [
  {
    text: "First task",
    timestamp: "00:01:23.456",
    mode: "submit" as const,
  },
  {
    text: "Second task",
    timestamp: "00:05:10.200",
    mode: "typing-start" as const,
  },
  {
    text: "Third task",
    timestamp: "00:12:45.789",
    mode: "submit" as const,
  },
];

const meta = {
  component: MarkdownExportDialog,
  args: {
    open: true,
    onOpenChange: fn(),
    entries: sampleEntries,
  },
} satisfies Meta<typeof MarkdownExportDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    const body = within(document.body);

    // Dialog should be visible with title
    await expect(body.getByText("Export as Markdown")).toBeInTheDocument();

    // Textarea should contain markdown table
    const textarea = body.getByTestId("markdown-export-textarea") as HTMLTextAreaElement;
    await expect(textarea).toBeInTheDocument();
    await expect(textarea.value).toContain("| Text | Timestamp | Mode |");
    await expect(textarea.value).toContain("| First task | 00:01:23.456 | Submit |");
    await expect(textarea.value).toContain("| Second task | 00:05:10.200 | Typing Start |");
    await expect(textarea.value).toContain("| Third task | 00:12:45.789 | Submit |");

    // Textarea should be readonly
    await expect(textarea).toHaveAttribute("readonly");

    // Copy button should be present
    await expect(body.getByTestId("copy-markdown-button")).toBeInTheDocument();
    await expect(body.getByTestId("copy-markdown-button")).toHaveTextContent("Copy to Clipboard");
  },
};

export const EmptyEntries: Story = {
  args: {
    entries: [],
  },
  play: async () => {
    const body = within(document.body);

    // Textarea should be empty
    const textarea = body.getByTestId("markdown-export-textarea") as HTMLTextAreaElement;
    await expect(textarea.value).toBe("");
  },
};

export const CloseDialog: Story = {
  play: async ({
    args,
  }) => {
    const body = within(document.body);

    // Click the close button
    await userEvent.click(body.getByTestId("dialog-close-button"));

    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};
