"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { InspectOutline } from "@/app/componentes/inspect-outline";
import { ease } from "@/app/lib/motion";
import { markIntroPlayed } from "./intro-flag";

type HeroIntroProps = {
  /** The hero <section>; the intro drives its [data-hero] elements in place. */
  rootRef: RefObject<HTMLElement | null>;
};

type Range = readonly [number, number];

// Timeline in ms (Motion board 12:21). The page is usable at ~1000 ms.
const T = {
  nameDuration: 700,
  lastNameDelay: 90,
  photo: [250, 1000],
  copy: [600, 1000],
  outlineDraw: [800, 1400],
  handles: [1100, 1400],
  tagType: [1400, 1750],
  outlineOut: [2400, 2600],
  // Hard stop in case a timer is lost: nothing may stay hidden.
  safety: 3000,
} as const satisfies Record<string, number | Range>;

const CLEARED_PROPS = ["transform", "opacity", "clip-path"] as const;

type Curve = typeof ease.out | ((t: number) => number);
type Keyframes = Record<string, string[] | number[]>;

// Orchestrates the one-time hero entrance. The hidden initial states live in
// globals.css under html[data-intro="play"] (set by INTRO_BOOT_SCRIPT before paint);
// this component animates to the natural state and then removes the attribute.
export const HeroIntro = ({ rootRef }: HeroIntroProps) => {
  const reduceMotion = useReducedMotion();
  const [nameEl, setNameEl] = useState<HTMLElement | null>(null);
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

    const clearAll = () => {
      html.removeAttribute("data-intro");
      for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-hero]"))) {
        for (const prop of CLEARED_PROPS) el.style.removeProperty(prop);
      }
    };

    if (reduceMotion) {
      // No movement and no outline; the boot script normally never sets "play" here.
      clearAll();
      return;
    }

    const controls: AnimationPlaybackControls[] = [];
    const timers: number[] = [];
    const all = (scope: ParentNode, selector: string) =>
      Array.from(scope.querySelectorAll<HTMLElement>(selector));
    const run = (
      els: HTMLElement[],
      keyframes: Keyframes,
      [from, to]: Range,
      curve: Curve = ease.out,
      extraDelay = 0,
    ) => {
      for (const el of els) {
        controls.push(
          animate(el, keyframes, {
            duration: (to - from) / 1000,
            delay: (from + extraDelay) / 1000,
            ease: curve,
          }),
        );
      }
    };

    const t0 = performance.now();
    const rise = { transform: ["translateY(100%)", "translateY(0%)"] };
    const [first, last] = all(root, '[data-hero="name-line"]');
    if (first) run([first], rise, [0, T.nameDuration]);
    if (last) run([last], rise, [0, T.nameDuration], ease.out, T.lastNameDelay);
    run(all(root, '[data-hero="photo"]'), { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, T.photo);
    run(
      all(root, '[data-hero="bio"], [data-hero="actions"]'),
      { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] },
      T.copy,
    );

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach((id) => window.clearTimeout(id));
      controls.forEach((c) => c.cancel());
      clearAll();
      setNameEl(null);
    };
    stopRef.current = finish;
    timers.push(window.setTimeout(finish, T.outlineOut[1] + 50));
    timers.push(window.setTimeout(finish, T.safety));

    // The outline mounts through a portal into the h1; give it a tick to render and measure.
    timers.push(
      window.setTimeout(() => {
        if (finished) return;
        setNameEl(root.querySelector<HTMLElement>('[data-hero="name"]'));
        timers.push(
          window.setTimeout(() => {
            if (finished) return;
            const outline = root.querySelector<HTMLElement>('[data-hero="name"] > [aria-hidden="true"]');
            if (!outline) return;
            // Delays are relative to t0, so subtract the time already elapsed.
            const elapsed = performance.now() - t0;
            const at = ([from, to]: Range): Range => [from - elapsed, to - elapsed];
            const tag = outline.querySelector<HTMLElement>('[data-part="tag"]');
            const steps = Math.max(1, tag?.textContent?.length ?? 1);

            // Set the hidden states by hand so nothing shows during the delay before each part.
            for (const box of all(outline, '[data-part="box"]')) box.style.clipPath = "inset(0 100% 100% 0)";
            for (const handle of all(outline, '[data-part="handle"]')) handle.style.opacity = "0";
            outline.style.opacity = "1";
            run(
              all(outline, '[data-part="box"]'),
              { clipPath: ["inset(0 100% 100% 0)", "inset(0% 0% 0% 0%)"] },
              at(T.outlineDraw),
              ease.inOut,
            );
            run(all(outline, '[data-part="handle"]'), { opacity: [0, 1] }, at(T.handles));
            if (tag) {
              tag.style.clipPath = "inset(0 100% 0 0)";
              run(
                [tag],
                { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
                at(T.tagType),
                (t) => Math.floor(t * steps) / steps,
              );
            }
            run([outline], { opacity: [1, 0] }, at(T.outlineOut));
          }, 50),
        );
      }, 0),
    );

    return scheduleStop;
  }, [reduceMotion, rootRef]);

  if (!nameEl) return null;
  return createPortal(<InspectOutline measure selector="h1" className="opacity-0" />, nameEl);
};
