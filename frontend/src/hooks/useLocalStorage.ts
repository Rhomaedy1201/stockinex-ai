import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  storageKey: string,
  defaultValue: T,
): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const result =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
      return result;
    });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (err) {
      console.warn("Failed to save to localStorage:", err);
    }
  }, [storageKey, value]);

  return [value, updateValue];
}
