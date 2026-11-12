"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TbArrowNarrowUp } from "react-icons/tb";
import { useLanguage } from "@/app/componentes/context/language-context";
import { duration, ease } from "@/app/lib/motion";

const SHOW_AFTER_VIEWPORTS = 1.5;

export const BackToTop = () => {
  const { translations } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () =>
      setShow(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORTS);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  const hidden = { opacity: 0, y: reduceMotion ? 0 : 8 };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 right-4 z-20"
          initial={hidden}
          animate={{ opacity: 1, y: 0 }}
          exit={hidden}
          transition={{ duration: duration.base, ease: ease.out }}
        >
          <button
            type="button"
            onClick={handleClick}
            aria-label={translations.a11y.backToTop}
            className="flex size-12 items-center justify-center rounded-full border border-line bg-surface text-text transition-transform duration-fast ease-out active:scale-[0.97] motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-text [@media(hover:hover)_and_(pointer:fine)]:hover:text-bg"
          >
            <TbArrowNarrowUp size={20} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
