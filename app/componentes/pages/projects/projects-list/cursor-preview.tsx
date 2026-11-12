"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type SpringOptions,
} from "motion/react";
import { spring } from "@/app/lib/motion";

const MAX_TILT = 6;
const VELOCITY_FOR_MAX_TILT = 1500;
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

type CursorPreviewProps = {
  /** Thumbnail of the hovered row; null hides the preview. */
  src: string | null;
};

const subscribeHover = (notify: () => void) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(HOVER_QUERY);
  query.addEventListener?.("change", notify);
  return () => query.removeEventListener?.("change", notify);
};
const getCanHover = () => typeof window.matchMedia === "function" && window.matchMedia(HOVER_QUERY).matches;
const useCanHover = () => useSyncExternalStore(subscribeHover, getCanHover, () => false);

/** Image that trails the mouse with a spring and tilts (up to ±6°) with its velocity. */
export const CursorPreview = ({ src }: CursorPreviewProps) => {
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  if (!canHover || reduced) return null;
  return <Follower src={src} />;
};

const Follower = ({ src }: CursorPreviewProps) => {
  const x = useSpring(0, spring.cursor as SpringOptions);
  const y = useSpring(0, spring.cursor as SpringOptions);
  const tilt = useSpring(
    useTransform(useVelocity(x), [-VELOCITY_FOR_MAX_TILT, VELOCITY_FOR_MAX_TILT], [-MAX_TILT, MAX_TILT], { clamp: true }),
    spring.cursor as SpringOptions,
  );
  const placed = useRef(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!placed.current) {
        placed.current = true;
        x.jump(event.clientX);
        y.jump(event.clientY);
        return;
      }
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
      <motion.div style={{ x, y }}>
        <AnimatePresence>
          {src && (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={spring.cursor}
              style={{ rotate: tilt }}
              className="relative -mt-[150px] ml-2 h-[190px] w-[320px] overflow-hidden rounded-[10px] shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
            >
              <Image src={src} alt="" fill sizes="320px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
