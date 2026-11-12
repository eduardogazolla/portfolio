import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe `matchMedia`. The server snapshot is `false`, so the first client render matches
 * the server HTML; the real value arrives right after hydration.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (typeof window.matchMedia !== "function") return () => {};
      const list = window.matchMedia(query);
      list.addEventListener?.("change", notify);
      return () => list.removeEventListener?.("change", notify);
    },
    [query]
  );
  const getSnapshot = () => typeof window.matchMedia === "function" && window.matchMedia(query).matches;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
