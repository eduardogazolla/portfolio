"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { InspectOutline } from "@/app/componentes/inspect-outline";
import { ease } from "@/app/lib/motion";
import { markIntroPlayed } from "./intro-flag";

type HeroIntroProps = {
  /** The hero <section>. */
  rootRef: RefObject<HTMLElement | null>;
};

type Range = readonly [number, number];

// Outline timeline in ms (Motion board 12:21), measured from first paint. The name, photo
// and copy entrances are CSS keyframes in globals.css so they do not wait for hydration;
// this component only draws the outline, writes the session flag and cleans up.
const T = {
  outlineDraw: [800, 1400],
  handles: [1100, 1400],
  tagType: [1400, 1750],
  outlineOut: [2400, 2600],
  end: 2650,
  // Hard stop in case a timer is lost: nothing may stay hidden.
  safety: 3000,
} as const satisfies Record<string, number | Range>;

const TAG_WAIT_MS = 300;

// Draws the Inspect outline around the "Gazolla" line, types its measurement, fades it
// out, then removes <html data-intro> (the CSS entrances end on the normal visible state).
export const HeroIntro = ({ rootRef }: HeroIntroProps) => {
  const reduceMotion = useReducedMotion();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const startedRef = useRef(false);
  const stopRef = useRef<(() => void) | null>(null);
  const pendingStopRef = useRef<number | null>(null);

  useEffect(() => {
    // React Strict Mode runs cleanup + effect once in development: keep the run alive.
    if (pendingStopRef.current !== null) {
      window.clearTimeout(pendingStopRef.current);
      pendingStopRef.current = null;
    }
    const scheduleStop = () => {
      pendingStopRef.current = window.setTimeout(() => {
        pendingStopRef.current = null;
        stopRef.current?.();
      }, 0);
    };
    if (startedRef.current) return scheduleStop;

    const root = rootRef.current;
    const html = document.documentElement;
    if (!root || html.dataset.intro !== "play") return;
    startedRef.current = true;
    markIntroPlayed();
    // This component owns the end of the intro from here on.
    if (window.__portfolioIntroTimer !== undefined) window.clearTimeout(window.__portfolioIntroTimer);

    // The CSS timeline started at first paint; read its clock so the outline stays in sync.
    const cssClock = root.querySelector<HTMLElement>('[data-hero="name-line"]')?.getAnimations?.()[0]?.currentTime;
    const startElapsed = typeof cssClock === "number" ? cssClock : 0;
    const t0 = performance.now() - startElapsed;
    const elapsed = () => performance.now() - t0;

    const controls: AnimationPlaybackControls[] = [];
    const timers: number[] = [];
    let frame = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      controls.forEach((c) => c.cancel());
      html.removeAttribute("data-intro");
      setTarget(null);
    };
    stopRef.current = finish;

    if (reduceMotion) {
      // No outline; the boot script normally never sets "play" here.
      finish();
      return;
    }

    timers.push(window.setTimeout(finish, Math.max(0, T.end - elapsed())));
    timers.push(window.setTimeout(finish, Math.max(0, T.safety - elapsed())));

    const run = (
      els: HTMLElement[],
      keyframes: Record<string, string[] | number[]>,
      [from, to]: Range,
      curve: typeof ease.out | ((t: number) => number) = ease.out,
    ) => {
      for (const el of els) {
        controls.push(
          animate(el, keyframes, {
            duration: (to - from) / 1000,
            delay: Math.max(0, from - elapsed()) / 1000,
            ease: curve,
          }),
        );
      }
    };

    const playOutline = (outline: HTMLElement) => {
      const parts = (selector: string) => Array.from(outline.querySelectorAll<HTMLElement>(selector));
      const tag = outline.querySelector<HTMLElement>('[data-part="tag"]');
      // Hidden states set by hand so nothing shows during the delay before each part.
      for (const box of parts('[data-part="box"]')) box.style.clipPath = "inset(0 100% 100% 0)";
      for (const handle of parts('[data-part="handle"]')) handle.style.opacity = "0";
      if (tag) tag.style.clipPath = "inset(0 100% 0 0)";
      outline.style.opacity = "1";

      run(parts('[data-part="box"]'), { clipPath: ["inset(0 100% 100% 0)", "inset(0% 0% 0% 0%)"] }, T.outlineDraw, ease.inOut);
      run(parts('[data-part="handle"]'), { opacity: [0, 1] }, T.handles);
      if (tag) {
        const steps = Math.max(1, tag.textContent?.length ?? 1);
        run([tag], { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, T.tagType, (t) => Math.floor(t * steps) / steps);
      }
      run([outline], { opacity: [1, 0] }, T.outlineOut);
    };

    // Mount the outline through a portal, then poll (per frame) until its tag has measured.
    // Without a tag (touch devices) the box and handles play alone after TAG_WAIT_MS.
    const lastName = root.querySelector<HTMLElement>('[data-hero="name-last"]');
    let waitStart = 0;
    const poll = (now: number) => {
      if (finished) return;
      if (!waitStart) waitStart = now;
      const outline = lastName?.querySelector<HTMLElement>(':scope > [aria-hidden="true"]');
      const tagReady = outline?.querySelector('[data-part="tag"]');
      if (outline && (tagReady || now - waitStart >= TAG_WAIT_MS)) {
        playOutline(outline);
        return;
      }
      frame = window.requestAnimationFrame(poll);
    };
    frame = window.requestAnimationFrame(() => {
      if (finished) return;
      setTarget(lastName);
      frame = window.requestAnimationFrame(poll);
    });

    return scheduleStop;
  }, [reduceMotion, rootRef]);

  if (!target) return null;
  return createPortal(<InspectOutline measure selector="h1.name" className="opacity-0" />, target);
};
