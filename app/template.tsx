"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { duration, ease } from "@/app/lib/motion";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";

// Set once the first page of the visit has mounted. Module state is only written in an effect,
// which never runs on the server, so server HTML is always the visible state (no JS needed).
let hasMounted = false;

/**
 * Page transition (Motion board 12:21): the new page enters with opacity and y 8 -> 0 on
 * `duration.base`; reduced motion is a fade only. Enter only: a template remounts on navigation, so
 * the old page is already gone and AnimatePresence has nothing to hold for an exit (that needs
 * Next's internal FrozenRouter hack). The first page of a visit renders in place because the Home
 * intro owns that moment.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <motion.div
      initial={hasMounted ? { opacity: 0, y: reduced ? 0 : 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
