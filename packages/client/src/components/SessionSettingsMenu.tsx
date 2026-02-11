import { useState } from "react";

import { ClipboardCopy, EllipsisVertical, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/AlertDialog";
import { MarkdownExportDialog } from "@/components/dialogs/MarkdownExportDialog";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: "submit" | "typing-start";
}

interface SessionSettingsMenuProps {
  sessionName: string;
  entries: TimerEntry[];
  onDeleteSession: () => void;
}

export function SessionSettingsMenu({
  sessionName,
  entries,
  onDeleteSession,
}: SessionSettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [showMarkdownDialog, setShowMarkdownDialog] = useState(false);
  const [showDeleteSessionDialog, setShowDeleteSessionDialog] = useState(false);

  const handleDeleteSession = () => {
    onDeleteSession();
    setShowDeleteSessionDialog(false);
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            data-testid="session-settings-trigger"
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-48 p-1"
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            disabled={entries.length === 0}
            onClick={() => {
              setOpen(false);
              setShowMarkdownDialog(true);
            }}
            data-testid="export-markdown-button"
          >
            <ClipboardCopy className="mr-2 size-4" />
            Export as Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive"
            onClick={() => {
              setOpen(false);
              setShowDeleteSessionDialog(true);
            }}
            data-testid="delete-session-button"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Session
          </Button>
        </PopoverContent>
      </Popover>

      <MarkdownExportDialog
        open={showMarkdownDialog}
        onOpenChange={setShowMarkdownDialog}
        entries={entries}
      />

      <AlertDialog
        open={showDeleteSessionDialog}
        onOpenChange={setShowDeleteSessionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="delete-session-title">Delete Session?</AlertDialogTitle>
            <AlertDialogDescription data-testid="delete-session-description">
              Are you sure you want to delete &quot;
              {sessionName}
              &quot;? All entries in this session will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-session">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSession}
              data-testid="confirm-delete-session"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
