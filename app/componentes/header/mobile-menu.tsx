"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { Button } from "@/app/componentes/button";
import { Link } from "@/app/componentes/link";
import { useLanguage } from "@/app/componentes/context/language-context";
import { LanguageSelector } from "./language-selector";
import { ease } from "@/app/lib/motion";
import { cn } from "@/app/lib/utils";
import type { Social } from "@/app/types/page-info";
import { getSocialLabel } from "@/app/utils/socials";

type MobileMenuProps = {
  socials: Social[];
};

type Origin = { x: number; y: number; radius: number };

// Motion board 12:21: the menu opens on "base" (220 ms), links rise 40 ms apart, it closes in
// 180 ms, and reduced motion is a 140 ms fade.
const OPEN_DURATION = 0.22;
const CLOSE_DURATION = 0.18;
const FADE_DURATION = 0.14;
const LINK_STAGGER = 0.04;
const LINK_START = 0.06;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

const circle = (origin: Origin, radius: number) =>
  `circle(${radius}px at ${origin.x}px ${origin.y}px)`;

const originFrom = (element: HTMLElement): Origin => {
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const { innerWidth: w, innerHeight: h } = window;
  // Distance to the farthest viewport corner, so the circle always covers the screen.
  const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  return { x, y, radius };
};

type MenuDialogProps = {
  id: string;
  label: string;
  origin: Origin;
  socials: Social[];
  onClose: () => void;
};

const MenuDialog = ({ id, label, origin, socials, onClose }: MenuDialogProps) => {
  const { translations } = useLanguage();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  // False while AnimatePresence plays the exit: the trap must let go so focus can return to the trigger.
  const isPresent = useIsPresent();

  // Move focus into the dialog on open.
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>("[data-menu-close]")?.focus();
  }, []);

  // Trap Tab inside the dialog while it is present.
  useEffect(() => {
    if (!isPresent) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, isPresent]);

  const links = [
    { label: translations.header.home, href: "/" },
    { label: translations.header.projects, href: "/projects" },
    { label: translations.menu.experience, href: "/#experience" },
    { label: translations.contactVoice.menuLabel, href: "/#contact" },
  ];

  const dialogMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: FADE_DURATION } },
        exit: { opacity: 0, transition: { duration: FADE_DURATION } },
      }
    : {
        initial: { clipPath: circle(origin, 0) },
        animate: {
          clipPath: circle(origin, origin.radius),
          transition: { duration: OPEN_DURATION, ease: ease.out },
        },
        exit: {
          clipPath: circle(origin, 0),
          transition: { duration: CLOSE_DURATION, ease: ease.out },
        },
      };

  return (
    <motion.div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-mobile-menu
      inert={!isPresent}
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto overscroll-contain bg-bg px-5 pb-10 pt-4"
      {...dialogMotion}
    >
      <div className="flex items-center justify-between">
        <NextLink href="/" onClick={onClose} className="min-w-0 truncate text-label-m text-text">
          Eduardo Gazolla
        </NextLink>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector />
          <Button
            data-menu-close
            variant="secondary"
            className="min-h-11 border-text px-5 py-3 min-[360px]:px-7 min-[360px]:py-4"
            onClick={onClose}
          >
            {translations.menu.close}
          </Button>
        </div>
      </div>

      <nav aria-label={translations.a11y.mainNavigation} className="py-10">
        <ul className="flex flex-col gap-1">
          {links.map((item, index) => {
            const isCurrent = pathname === item.href;
            return (
              <motion.li
                key={item.href}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: OPEN_DURATION,
                    ease: ease.out,
                    delay: LINK_START + index * LINK_STAGGER,
                  },
                }}
              >
                <NextLink
                  href={item.href}
                  onClick={onClose}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-[14px] font-display font-extrabold leading-[0.92] tracking-[-0.03em]",
                    "[font-size:clamp(44px,16.4vw,64px)]",
                    "transition-colors duration-fast ease-out motion-reduce:transition-none",
                    "[@media(hover:hover)_and_(pointer:fine)]:hover:text-text",
                    isCurrent ? "text-text" : "text-text-muted"
                  )}
                >
                  {isCurrent && (
                    <span
                      data-current-dot
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-full bg-accent"
                    />
                  )}
                  {item.label}
                </NextLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-5">
        {socials.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((social) => (
              <li key={social.url}>
                <Link href={social.url} className="text-label-m">
                  {getSocialLabel(social)}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Button
          href="/#contact"
          data-menu-cta
          onClick={onClose}
          className="w-full px-7 py-4"
        >
          {translations.contactVoice.primaryButton}
        </Button>
      </div>
    </motion.div>
  );
};

export const MobileMenu = ({ socials }: MobileMenuProps) => {
  const { translations } = useLanguage();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0, radius: 0 });
  const dialogId = useId();
  const triggerId = useId();

  // Where focus goes once the menu is closed (and the page is no longer inert).
  const returnFocusTo = useRef<"trigger" | "main">("trigger");

  const close = useCallback(() => {
    returnFocusTo.current = "trigger";
    setOpen(false);
  }, []);

  const handleOpen = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setOrigin(originFrom(event.currentTarget));
    setOpen(true);
  };

  // Lock page scroll while open; restore the previous value on close and on unmount.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Make everything outside the dialog inert while it is open (it is portalled to <body>).
  useEffect(() => {
    if (!open) return;
    const changed = Array.from(document.body.children).filter(
      (el) => !el.hasAttribute("data-mobile-menu") && !el.hasAttribute("inert")
    );
    changed.forEach((el) => el.setAttribute("inert", ""));
    return () => changed.forEach((el) => el.removeAttribute("inert"));
  }, [open]);

  // Once closed (and no longer inert), hand focus back.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) {
      const target =
        returnFocusTo.current === "main"
          ? document.getElementById("main")
          : document.getElementById(triggerId);
      target?.focus();
    }
    wasOpen.current = open;
  }, [open, triggerId]);

  // The menu is for narrow screens: close it if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      // The Menu button is hidden at this width, so focus goes to the page content instead.
      returnFocusTo.current = "main";
      setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <Button
        id={triggerId}
        variant="secondary"
        className="min-h-11 px-5 py-3 min-[360px]:px-7 min-[360px]:py-4 md:hidden"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={handleOpen}
      >
        {translations.menu.open}
      </Button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <MenuDialog
                id={dialogId}
                label={translations.menu.open}
                origin={origin}
                socials={socials}
                onClose={close}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
