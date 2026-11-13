"use client";

import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { Button } from "@/app/componentes/button";
import { useLanguage } from "@/app/componentes/context/language-context";
import { cn } from "@/app/lib/utils";
import { cvFileName } from "@/cv/source/html";
import type { CvVariant } from "@/cv/source/types";

type CvDownloadProps = {
  /** "button": secondary pill (hero). "link": text link (contact, footer). */
  variant?: "button" | "link";
  /** Where the list opens. Use "top" near the bottom of the page (footer). */
  placement?: "bottom" | "top";
  className?: string;
  /** Extra classes for the list, e.g. to align it to the trigger's right edge. */
  listClassName?: string;
};

const VERSIONS: CvVariant[] = ["qa", "java"];

const hover = "[@media(hover:hover)_and_(pointer:fine)]:";

/**
 * "Download CV" disclosure: a button that reveals the CV versions in the site's language
 * (PDFs built by `npm run cv:build` into public/cv).
 */
export const CvDownload = ({ variant = "button", placement = "bottom", className, listClassName }: CvDownloadProps) => {
  const { locale, translations } = useLanguage();
  const t = translations.cv;
  const lang = locale === "en" ? "en" : "pt";
  const [open, setOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeAndRefocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Listen on the document while open: a press outside doesn't always move focus, and Safari
  // doesn't focus a clicked button, so Escape may reach <body> instead of this component.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close when keyboard focus moves to something else. A null target (a press on the list's
  // padding, or leaving the window) is not a move away: outside presses are handled above.
  const onBlur = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && !rootRef.current?.contains(next)) setOpen(false);
  };

  const chevron = (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 shrink-0 transition-transform duration-fast ease-out motion-reduce:transition-none",
        open !== (placement === "top") && "rotate-180"
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );

  const triggerProps = {
    ref: triggerRef,
    "aria-expanded": open,
    "aria-controls": listId,
    onClick: () => setOpen((value) => !value),
  };

  return (
    <div ref={rootRef} className={cn("relative w-fit", className)} onBlur={onBlur}>
      {variant === "button" ? (
        <Button {...triggerProps} variant="secondary" className="px-7 py-4">
          {t.download}
          {chevron}
        </Button>
      ) : (
        <button
          {...triggerProps}
          type="button"
          className={cn("inline-flex items-center gap-2 text-label-m text-text", `${hover}hover:text-accent`)}
        >
          {t.download}
          {chevron}
        </button>
      )}

      <ul
        id={listId}
        hidden={!open}
        className={cn(
          "absolute left-0 z-30 min-w-[200px] rounded-md border border-line bg-surface p-1.5",
          placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          listClassName
        )}
      >
        {/* Always rendered (only hidden): a link removed from the DOM mid-click can't start the download. */}
        {VERSIONS.map((version) => {
            const file = cvFileName(version, lang);
            const name = t[version];
            return (
              <li key={version}>
                <a
                  href={`/cv/${file}`}
                  download={file}
                  type="application/pdf"
                  aria-label={`${t.versionName(name)} (${t.fileType})`}
                  onClick={closeAndRefocus}
                  className={cn(
                    "flex items-center justify-between gap-8 rounded-sm px-4 py-3 text-label-m text-text",
                    `${hover}hover:bg-line`
                  )}
                >
                  {name}
                  <span className="text-mono-s font-mono text-text-muted">{t.fileType}</span>
                </a>
              </li>
            );
        })}
      </ul>
    </div>
  );
};
