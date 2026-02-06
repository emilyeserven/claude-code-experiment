import type { KeyboardEvent } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import { Check, Pencil, X } from "lucide-react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

interface SessionNameProps {
  name: string;
  onRename: (name: string) => void;
}

export function SessionName({
  name, onRename,
}: SessionNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    }
    else {
      setEditValue(name);
    }
    setIsEditing(false);
  }, [editValue, name, onRename]);

  const handleCancel = useCallback(() => {
    setEditValue(name);
    setIsEditing(false);
  }, [name]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
    else if (e.key === "Escape") {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1"
        data-testid="session-name-editor"
      >
        <Input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 w-48 text-center text-sm"
          data-testid="session-name-input"
        />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleSave}
          data-testid="session-name-save"
        >
          <Check className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCancel}
          data-testid="session-name-cancel"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1"
      data-testid="session-name-display"
    >
      <span
        className="text-sm font-medium text-muted-foreground"
        data-testid="session-name-text"
      >
        {name}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setIsEditing(true)}
        data-testid="session-name-edit-button"
      >
        <Pencil className="size-3" />
      </Button>
    </div>
  );
}
