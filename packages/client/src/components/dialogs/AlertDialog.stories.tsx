import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { within, expect, userEvent } from "@storybook/test";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import { Button } from "../Button";

const meta = {
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          data-testid="dialog-trigger"
        >
          Delete Item
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="dialog-cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction data-testid="dialog-action">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("dialog-trigger");

    await expect(trigger).toBeInTheDocument();
    await expect(trigger).toHaveTextContent("Delete Item");
  },
};

function ControlledAlertDialog() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string>("");

  return (
    <div>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            data-testid="controlled-trigger"
          >
            Open Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to proceed with this action?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-testid="controlled-cancel"
              onClick={() => setResult("cancelled")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="controlled-action"
              onClick={() => setResult("confirmed")}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p data-testid="dialog-result">
        {result}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledAlertDialog />,
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("controlled-trigger");

    await userEvent.click(trigger);

    // The dialog renders in a portal, so query the document body
    const body = within(document.body);
    await expect(body.getByText("Confirm Action")).toBeInTheDocument();
    await expect(body.getByText("Do you want to proceed with this action?")).toBeInTheDocument();
  },
};
