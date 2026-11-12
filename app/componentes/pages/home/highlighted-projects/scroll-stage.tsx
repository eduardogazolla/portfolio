"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useMediaQuery } from "@/app/lib/use-media-query";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";

type ScrollStageProps = {
  media: ReactNode;
  text: ReactNode;
};

// Motion board 12:21, "Projeto em destaque (Home)": the card is pinned for 1.5 screens ; the image
// grows 0.86 -> 1 while its radius goes 14 -> 0 (clip-path, so only compositor-friendly properties
// animate); then title and text fade in. Linked to scroll progress, no timing curve.
const IMAGE_END = 0.6; // share of the pinned scroll spent on the image
const TEXT_START = 0.6;
const TEXT_END = 0.9;

const ActiveStage = ({ media, text }: ScrollStageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, IMAGE_END], [0.86, 1], { clamp: true });
  const radius = useTransform(scrollYProgress, [0, IMAGE_END], [14, 0], { clamp: true });
  const clipPath = useMotionTemplate`inset(0px round ${radius}px)`;
  const opacity = useTransform(scrollYProgress, [TEXT_START, TEXT_END], [0, 1], { clamp: true });
  const y = useTransform(scrollYProgress, [TEXT_START, TEXT_END], [12, 0], { clamp: true });

  // 100svh pinned + 1.5 viewports of scroll = 250svh.
  return (
    <div ref={ref} className="h-[250svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-8 py-20">
        <motion.div style={{ scale, clipPath }} className="max-h-[55svh] overflow-hidden [&>*]:rounded-none">
          {media}
        </motion.div>
        <motion.div style={{ opacity, y }}>{text}</motion.div>
      </div>
    </div>
  );
};

/**
 * Pins the card on desktop. Static (media above text) on small screens, with reduced motion, and in
 * the server HTML: both hooks report `false` until hydration, so no content depends on JS.
 */
export const ScrollStage = ({ media, text }: ScrollStageProps) => {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();

  if (!wide || reduced) {
    return (
      <div className="flex flex-col gap-6 md:gap-8">
        {media}
        {text}
      </div>
    );
  }
  return <ActiveStage media={media} text={text} />;
};
