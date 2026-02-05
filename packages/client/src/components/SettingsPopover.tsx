import React from "react";

import { Moon, Settings, Sun } from "lucide-react";

import { Button } from "@/components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { useTheme } from "@/hooks/useTheme";

const SettingsPopover: React.FunctionComponent = () => {
  const {
    theme, setTheme,
  } = useTheme();

  return (
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}
              data-testid="dark-mode-toggle"
            >
              {theme === "dark"
                ? (
                  <>
                    <Sun className="mr-1 size-4" />
                    {" "}
                    Light
                  </>
                )
                : (
                  <>
                    <Moon className="mr-1 size-4" />
                    {" "}
                    Dark
                  </>
                )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { SettingsPopover };
