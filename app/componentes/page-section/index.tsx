import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

type PageSectionProps = {
  id?: string;
  /** Vertical spacing for the section. */
  className?: string;
  /** Layout of the content box. */
  innerClassName?: string;
  children: ReactNode;
};

// Same horizontal pattern as the header, hero and footer: 20px gutter (40px from lg),
// content capped at max-w-content and centred.
export const PageSection = ({ id, className, innerClassName, children }: PageSectionProps) => (
  <section id={id} className={cn("px-5 lg:px-10", className)}>
    <div className={cn("mx-auto w-full max-w-content", innerClassName)}>{children}</div>
  </section>
);
