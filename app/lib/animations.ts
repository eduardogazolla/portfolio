import { duration, ease } from "./motion";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: duration.base, ease: ease.out },
};

export const techBadgeAnimation = fadeUp;

export const fadeUpAnimation = fadeUp;
