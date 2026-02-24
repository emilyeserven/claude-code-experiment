import type { InjectionKey, Ref } from "vue";

import { inject, provide, watch } from "vue";

import { useLocalStorage } from "./useLocalStorage";

export type Theme = "dark" | "light" | "system";

export interface ThemeState {
  theme: Ref<Theme>;
  setTheme: (theme: Theme) => void;
}

export const THEME_KEY: InjectionKey<ThemeState> = Symbol("Theme");

export function useTheme(): ThemeState {
  const state = inject(THEME_KEY);
  if (!state) {
    throw new Error("useTheme() was called without a provider. Make sure provideTheme() is called in a parent component.");
  }
  return state;
}

export function provideTheme(defaultTheme: Theme = "system", storageKey: string = "vite-ui-theme"): ThemeState {
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);

  const applyTheme = (value: Theme): void => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (value === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(value);
  };

  // Apply theme immediately on creation
  applyTheme(theme.value);

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  const state: ThemeState = {
    theme,
    setTheme,
  };

  provide(THEME_KEY, state);

  return state;
}
