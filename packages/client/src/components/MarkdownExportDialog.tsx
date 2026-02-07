import { useCallback, useRef, useState } from "react";

import { Check, ClipboardCopy } from "lucide-react";

import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

interface TimerEntry {
  text: string;
  timestamp: string;
}

interface MarkdownExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: TimerEntry[];
}

function entriesToMarkdown(entries: TimerEntry[]): string {
  if (entries.length === 0) {
    return "";
  }

  const header = "| Text | Timestamp |";
  const separator = "| --- | --- |";
  const rows = entries.map(entry => `| ${entry.text} | ${entry.timestamp} |`);

  return [header, separator, ...rows].join("\n");
}

export function MarkdownExportDialog({
  open,
  onOpenChange,
  entries,
}: MarkdownExportDialogProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const markdown = entriesToMarkdown(entries);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          setCopied(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export as Markdown</DialogTitle>
          <DialogDescription>
            Copy the markdown below to use your entries elsewhere.
          </DialogDescription>
        </DialogHeader>
        <textarea
          ref={textareaRef}
          readOnly
          value={markdown}
          className={`
            h-48 w-full resize-none rounded-md border bg-muted px-3 py-2
            font-mono text-sm
            focus:ring-2 focus:ring-ring focus:outline-none
          `}
          data-testid="markdown-export-textarea"
        />
        <DialogFooter>
          <Button
            onClick={handleCopy}
            data-testid="copy-markdown-button"
          >
            {copied
              ? (
                <>
                  <Check className="size-4" />
                  Copied!
                </>
              )
              : (
                <>
                  <ClipboardCopy className="size-4" />
                  Copy to Clipboard
                </>
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
