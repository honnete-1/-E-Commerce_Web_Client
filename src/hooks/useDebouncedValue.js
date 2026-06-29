import { useEffect, useState } from "react";

// UI state (the raw input value) is local and immediate; the debounced
// value is what actually drives the server query, so we don't fire a
// network request on every keystroke.
export function useDebouncedValue(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
