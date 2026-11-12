"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** Makes every motion/react animation honor the visitor's reduced-motion setting. */
export const AppMotionConfig = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
