"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useMediaQuery } from "@/app/lib/use-media-query";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";

type ScrollStageProps = {
  media: ReactNode;
  text: ReactNode;
};

// Motion board 12:21, "Projeto em destaque (Home)": the card is pinned for 1 screen of scroll; the
// image grows 0.86 -> 1 while its radius goes 14 -> 0 (clip-path: it repaints each frame, but it is
// the only way to round a scaling frame without distorting the corners; the scale itself is
// transform-only); then title and text fade in. Linked to scroll progress, no timing curve.
const IMAGE_END = 0.6; // share of the pinned scroll spent on the image
const TEXT_START = 0.6;
const TEXT_END = 0.9;

// The pinned layout needs room: desktop width and at least 640px of height. Below that the card is
// static. Expressed in CSS (class strings are literal so Tailwind sees them, and mirror
// `ACTIVE_QUERY`) so the server HTML already has the final
// layout and JS only drives the transforms. `motion-safe` keeps reduced motion static.
const ACTIVE_QUERY = "(min-width: 768px) and (min-height: 640px)";

export const ScrollStage = ({ media, text }: ScrollStageProps) => {
  const wide = useMediaQuery(ACTIVE_QUERY);
  const reduced = usePrefersReducedMotion();
  const active = wide && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, IMAGE_END], [0.86, 1], { clamp: true });
  const radius = useTransform(scrollYProgress, [0, IMAGE_END], [14, 0], { clamp: true });
  const clipPath = useMotionTemplate`inset(0px round ${radius}px)`;
  const opacity = useTransform(scrollYProgress, [TEXT_START, TEXT_END], [0, 1], { clamp: true });
  const y = useTransform(scrollYProgress, [TEXT_START, TEXT_END], [12, 0], { clamp: true });

  // Re-render only when the text crosses the threshold, not per frame.
  const [textVisible, setTextVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const visible = v >= TEXT_START;
    setTextVisible((prev) => (prev === visible ? prev : visible));
  });

  return (
    // 100svh pinned + 100svh of scroll = 200svh.
    <div ref={ref} className="[@media(min-width:768px)_and_(min-height:640px)]:motion-safe:h-[200svh]">
      <div
        className="flex flex-col gap-6 md:gap-8 [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:sticky [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:top-0 [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:h-[100svh] [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:justify-center [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:py-16"
      >
        {/* Width follows the 1200/620 aspect from a height budget, so the whole image scales. */}
        <motion.div
          style={active ? { scale, clipPath } : undefined}
          className="[@media(min-width:768px)_and_(min-height:640px)]:motion-safe:mx-auto [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:w-[min(100%,calc(min(60svh,100svh_-_360px)_*_1200_/_620))] [@media(min-width:768px)_and_(min-height:640px)]:motion-safe:[&>*]:rounded-none"
        >
          {media}
        </motion.div>
        <motion.div style={active ? { opacity, y } : undefined} inert={active && !textVisible}>
          {text}
        </motion.div>
      </div>
    </div>
  );
};
