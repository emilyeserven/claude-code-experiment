import { createContext, useContext } from "react";

/**
 * Creates a React context and a hook that throws if used outside its provider.
 * Eliminates the repetitive pattern of context creation + safe hook across providers.
 */
export function createSafeContext<T>(providerName: string) {
  const Context = createContext<T | undefined>(undefined);

  function useSafeContext(): T {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(`use${providerName} must be used within ${providerName}Provider`);
    }
    return context;
  }

  return [Context, useSafeContext] as const;
}
