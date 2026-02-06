import React, { useState } from "react";

import { ArrowLeftRight, Moon, Settings, Sun } from "lucide-react";
import { Switch as SwitchPrimitive } from "radix-ui";

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
} from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { SessionSwitcherDialog } from "@/components/SessionSwitcherDialog";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const SettingsPopover: React.FunctionComponent = () => {
  const {
    theme, setTheme,
  } = useTheme();
  const {
    sessions, activeSession, switchSession, createSession,
  } = useSession();
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            data-testid="settings-trigger"
          >
            <Settings className="size-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-64"
        >
          <div className="space-y-4">
            <h4 className="text-sm leading-none font-medium">Settings</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <SwitchPrimitive.Root
                checked={isDark}
                onCheckedChange={(checked) => { setTheme(checked ? "dark" : "light"); }}
                data-testid="dark-mode-toggle"
                className={cn(
                  `
                    relative inline-flex h-7 w-14 shrink-0 cursor-pointer
                    items-center rounded-full border-2 border-transparent
                    shadow-xs transition-colors
                    focus-visible:ring-2 focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                    focus-visible:outline-none
                    data-[state=checked]:bg-primary
                    data-[state=unchecked]:bg-input
                  `,
                )}
              >
                <Sun className="absolute left-1 size-3.5 text-amber-500" />
                <Moon className="absolute right-1 size-3.5 text-slate-300" />
                <SwitchPrimitive.Thumb
                  className={cn(
                    `
                      pointer-events-none z-10 flex size-5 items-center
                      justify-center rounded-full bg-background shadow-lg ring-0
                      transition-transform
                      data-[state=checked]:translate-x-7.5
                      data-[state=unchecked]:translate-x-0.5
                    `,
                  )}
                >
                  {isDark
                    ? <Moon className="size-3 text-primary" />
                    : <Sun className="size-3 text-amber-500" />}
                </SwitchPrimitive.Thumb>
              </SwitchPrimitive.Root>
            </div>
            <div className="border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSessionDialogOpen(true)}
                data-testid="switch-session-trigger"
              >
                <ArrowLeftRight className="size-4" />
                Switch Session
              </Button>
            </div>
            <div className="border-t pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    data-testid="reset-localstorage-trigger"
                  >
                    Reset Local Storage
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Local Storage?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all locally saved data including theme
                      preferences and timer entries. The page will reload
                      to apply defaults.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="reset-localstorage-cancel">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      data-testid="reset-localstorage-confirm"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <SessionSwitcherDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSwitchSession={switchSession}
        onCreateSession={createSession}
      />
    </>
  );
};

export { SettingsPopover };
