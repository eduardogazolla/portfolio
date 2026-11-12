"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";
import { useLanguage } from "@/app/componentes/context/language-context";

type InspectOutlineVariant = "static" | "dashed" | "hover";

type InspectOutlineProps = {
  variant?: InspectOutlineVariant;
  /** Tag text. Omit for no tag. The `dashed` variant defaults to "element not found". */
  label?: string;
  /** Replaces the tag text with "selector W × H" measured from the parent. */
  measure?: boolean;
  /** Selector shown when `measure` is on (e.g. "h1"). */
  selector?: string;
  className?: string;
};

const handlePositions = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
];

// Overlay drawn around its positioned parent (parent must be `relative`; for
// `hover` it must also be `group`). Box, handles and tag are separate elements
// so they can be animated individually.
export const InspectOutline = ({
  variant = "static",
  label,
  measure = false,
  selector = "",
  className,
}: InspectOutlineProps) => {
  const { translations } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    const target = rootRef.current?.parentElement;
    if (!measure || !target) return;

    const update = () => {
      const { width, height } = target.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };
    update();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(target);
    return () => observer.disconnect();
  }, [measure]);

  const baseLabel =
    label ?? (variant === "dashed" ? translations.a11y.elementNotFound : undefined);
  const tagText =
    measure && size
      ? `${selector} ${size.width} × ${size.height}`.trim()
      : baseLabel;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "hover" &&
          "opacity-0 transition-opacity duration-fast ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100",
        className
      )}
    >
      <div
        data-part="box"
        className={cn(
          "absolute inset-0 border border-accent",
          variant === "dashed" && "border-dashed"
        )}
      />
      {handlePositions.map((position) => (
        <span
          key={position}
          data-part="handle"
          className={cn("absolute h-2 w-2 bg-accent", position)}
        />
      ))}
      {tagText && (
        <span
          data-part="tag"
          className="absolute bottom-full left-0 mb-1 whitespace-nowrap rounded-sm bg-accent px-2 py-0.5 font-mono text-mono-s text-on-accent"
        >
          {tagText}
        </span>
      )}
    </div>
  );
};
