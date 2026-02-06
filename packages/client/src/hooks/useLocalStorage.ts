import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) return JSON.parse(item) as T;
      return defaultValue instanceof Function ? defaultValue() : defaultValue;
    }
    catch {
      return defaultValue instanceof Function ? defaultValue() : defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(nextValue));
      }
      catch {
        // Silently fail if localStorage is full or unavailable
      }
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
