import { createSafeContext } from "@/lib/createSafeContext";

export type Theme = "dark" | "light" | "system";

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const [ThemeProviderContext, useTheme] = createSafeContext<ThemeProviderState>("Theme");
