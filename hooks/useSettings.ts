import { useState, useEffect, useCallback } from "react";
import { storage } from "#imports";

/**
 * Type helper for storage items created with storage.defineItem
 */
type StorageItem<T> = ReturnType<typeof storage.defineItem<T>>;

/**
 * Generic hook to access and edit a setting stored in WXT Storage
 *
 * @param item - A storage item created with storage.defineItem
 * @returns An object containing the value, loading state, setter function, and error state
 *
 * @example
 * ```tsx
 * const wordsPerMinuteItem = storage.defineItem<number>('local:wordsPerMinute', {
 *   fallback: 200,
 * });
 *
 * function MyComponent() {
 *   const { value, loading, setValue, error } = useSettings(wordsPerMinuteItem);
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return (
 *     <input
 *       type="number"
 *       value={value}
 *       onChange={(e) => setValue(Number(e.target.value))}
 *     />
 *   );
 * }
 * ```
 */
export function useSettings<T>(
  item: StorageItem<T>,
  fallback?: T
): {
  value: T;
  loading: boolean;
  setValue: (newValue: T) => Promise<void>;
  error: Error | null;
} {
  // Use a temporary value until we load from storage
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unwatch: (() => void) | undefined;
    let cancelled = false;

    // Load initial value
    (async () => {
      try {
        const storedValue = await item.getValue();
        if (!cancelled) {
          // getValue() returns the fallback if value is null, so we can use it directly
          setValue(storedValue);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
          if (fallback !== undefined) {
            setValue(fallback);
          }
        }
      }

      // Watch for changes to this key from elsewhere
      if (!cancelled) {
        unwatch = item.watch((newValue: T | null) => {
          if (!cancelled) {
            // getValue() handles fallback, so newValue should never be null if fallback is set
            setValue(newValue ?? (fallback as T));
            setError(null);
          }
        });
      }
    })();

    return () => {
      cancelled = true;
      if (unwatch) {
        unwatch();
      }
    };
  }, [item, fallback]);

  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        await item.setValue(newValue);
        setValue(newValue);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [item]
  );

  // Return fallback value while loading or if value is null
  const currentValue = value ?? (fallback as T);

  return {
    value: currentValue,
    loading,
    setValue: updateValue,
    error,
  };
}

/**
 * Pre-defined storage items for common settings
 * These can be imported and used with useSettings hook
 */
export const settings = {
  /**
   * Words per minute reading speed setting
   */
  wordsPerMinute: storage.defineItem<number>("local:wordsPerMinute", {
    fallback: 200,
  }),
  /**
   * Start delay in seconds before RSVP begins
   */
  startDelay: storage.defineItem<number>("local:startDelay", {
    fallback: 0.5,
  }),
  /**
   * Hotkey to trigger/hold RSVP display (default: "Meta")
   */
  triggerHotkey: storage.defineItem<string>("local:triggerHotkey", {
    fallback: "Meta",
  }),
  /**
   * Hotkey to balance outward while trigger is held (default: "Shift")
   */
  balanceOutwardHotkey: storage.defineItem<string>(
    "local:balanceOutwardHotkey",
    {
      fallback: "Shift",
    }
  ),
  /**
   * Scale for RSVP display (default: 1.0)
   */
  scale: storage.defineItem<number>("local:scale", {
    fallback: 1.0,
  }),
  /**
   * Card background color (default: rgba(0, 0, 0, 0.95))
   */
  cardBackgroundColor: storage.defineItem<string>("local:cardBackgroundColor", {
    fallback: "#000000f0",
  }),
  /**
   * Card text color (default: white)
   */
  cardTextColor: storage.defineItem<string>("local:cardTextColor", {
    fallback: "#FFFFFF",
  }),
  /**
   * Card accent color (default: red.500)
   */
  cardAccentColor: storage.defineItem<string>("local:cardAccentColor", {
    fallback: "#FB2C36",
  }),
  /**
   * Punctuation delay multiplier for sentence-ending punctuation (default: 2.0)
   */
  punctuationDelay: storage.defineItem<number>("local:punctuationDelay", {
    fallback: 3.0,
  }),
  /**
   * Character used to represent new lines in text (default: "›")
   */
  newLineChar: storage.defineItem<string>("local:newLineChar", {
    fallback: "›",
  }),
} as const;
