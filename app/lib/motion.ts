import type { BezierDefinition, Transition } from "motion/react";

export const duration = { fast: 0.14, base: 0.22, slow: 0.7 } as const;

export const ease: { out: BezierDefinition; inOut: BezierDefinition } = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
};

export const spring: { ui: Transition; cursor: Transition } = {
  ui: { type: "spring", stiffness: 500, damping: 35 },
  cursor: { type: "spring", stiffness: 300, damping: 30 },
};
