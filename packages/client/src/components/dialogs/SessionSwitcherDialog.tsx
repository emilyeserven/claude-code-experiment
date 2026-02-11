import type { Session } from "@/context/SessionProviderContext";
import type { KeyboardEvent } from "react";

import { useCallback, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialogs/Dialog";
import { Input } from "@/components/Input";
import { cn } from "@/lib/utils";

interface SessionSwitcherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: Session[];
  activeSessionId: string;
  onSwitchSession: (id: string) => void;
  onCreateSession: (name: string) => void;
}

export function SessionSwitcherDialog({
  open,
  onOpenChange,
  sessions,
  activeSessionId,
  onSwitchSession,
  onCreateSession,
}: SessionSwitcherDialogProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  const handleSelect = useCallback((id: string) => {
    onSwitchSession(id);
    onOpenChange(false);
  }, [onSwitchSession, onOpenChange]);

  const handleCreate = useCallback(() => {
    const trimmed = newSessionName.trim();
    if (trimmed) {
      onCreateSession(trimmed);
      setNewSessionName("");
      setIsCreating(false);
      onOpenChange(false);
    }
  }, [newSessionName, onCreateSession, onOpenChange]);

  const handleCreateKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreate();
    }
    else if (e.key === "Escape") {
      setIsCreating(false);
      setNewSessionName("");
    }
  }, [handleCreate]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="switch-session-title">Switch Session</DialogTitle>
          <DialogDescription data-testid="switch-session-description">
            Select a session or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div
          className="max-h-60 space-y-1 overflow-y-auto"
          data-testid="session-list"
        >
          {sessions.map(session => (
            <button
              type="button"
              key={session.id}
              onClick={() => handleSelect(session.id)}
              className={cn(
                `
                  flex w-full items-center justify-between rounded-md px-3 py-2
                  text-left text-sm transition-colors
                  hover:bg-accent
                `,
                session.id === activeSessionId && "bg-accent font-medium",
              )}
              data-testid="session-list-item"
              data-session-id={session.id}
            >
              <span>{session.name}</span>
              <span className="text-xs text-muted-foreground">
                {session.entries.length}
                {" "}
                {session.entries.length === 1 ? "entry" : "entries"}
              </span>
            </button>
          ))}
        </div>
        <DialogFooter>
          {isCreating
            ? (
              <div className="flex w-full gap-2">
                <Input
                  value={newSessionName}
                  onChange={e => setNewSessionName(e.target.value)}
                  onKeyDown={handleCreateKeyDown}
                  placeholder="Session name..."
                  autoFocus
                  data-testid="new-session-name-input"
                />
                <Button
                  onClick={handleCreate}
                  disabled={!newSessionName.trim()}
                  data-testid="confirm-create-session"
                >
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewSessionName("");
                  }}
                  data-testid="cancel-create-session"
                >
                  Cancel
                </Button>
              </div>
            )
            : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCreating(true)}
                data-testid="new-session-button"
              >
                <Plus className="size-4" />
                New Session
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
