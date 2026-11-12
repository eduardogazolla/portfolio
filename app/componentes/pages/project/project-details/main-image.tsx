"use client";

import Image from "next/image";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/app/lib/use-prefers-reduced-motion";
import { motion, useScroll, useTransform } from "motion/react";

type MainImageProps = {
  src: string;
  alt: string;
};

// Full-bleed hero image. While it crosses the viewport it zooms 1.08 -> 1 and drifts 40px.
// Scroll-linked transforms are not covered by MotionConfig, so reduced motion is checked here (hydration-safe hook; the style is always present).
// The picture is taller than its frame so the drift never reveals an edge.
export const MainImage = ({ src, alt }: MainImageProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], reduced ? [1, 1] : [1.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-20, 20]);

  return (
    <div ref={frameRef} className="relative h-[240px] w-full overflow-hidden bg-surface md:h-[760px]">
      <motion.div
        className="absolute inset-x-0 -inset-y-6"
        style={{ scale, y }}
      >
        <Image src={src} alt={alt} fill sizes="100vw" quality={70} loading="eager" fetchPriority="high" className="object-cover" />
      </motion.div>
    </div>
  );
};
