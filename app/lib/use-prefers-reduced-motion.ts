import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (notify: () => void) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(QUERY);
  query.addEventListener?.("change", notify);
  return () => query.removeEventListener?.("change", notify);
};
const getSnapshot = () => typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches;

/**
 * Hydration-safe `prefers-reduced-motion`. The server snapshot is `false`, so the first client
 * render matches the server HTML; the real value arrives right after hydration.
 * (motion's `useReducedMotion` is null on the server but true on the client's first render.)
 */
export const usePrefersReducedMotion = (): boolean => useSyncExternalStore(subscribe, getSnapshot, () => false);
