import type { Ref } from "vue";

import { ref, watch } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)): [Ref<T>, (value: T | ((prev: T) => T)) => void] {
  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) return JSON.parse(item) as T;
      return defaultValue instanceof Function ? defaultValue() : defaultValue;
    }
    catch {
      return defaultValue instanceof Function ? defaultValue() : defaultValue;
    }
  };

  const storedValue = ref<T>(getInitialValue()) as Ref<T>;

  watch(storedValue, (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
    catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, { deep: true });

  const setValue = (value: T | ((prev: T) => T)): void => {
    const nextValue = value instanceof Function ? value(storedValue.value) : value;
    storedValue.value = nextValue;
    try {
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
    catch {
      // Silently fail if localStorage is full or unavailable
    }
  };

  return [storedValue, setValue];
}
