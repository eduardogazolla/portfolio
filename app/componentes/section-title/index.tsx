"use client";

import { cn } from "@/app/lib/utils";
import { InspectOutline } from "@/app/componentes/inspect-outline";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  /** Heading level. Defaults to h2. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
};

export const SectionTitle = ({
  title,
  subtitle,
  as: Heading = "h2",
  className,
}: SectionTitleProps) => (
  <div className={cn("flex flex-col gap-4", className)}>
    <Heading className="group relative w-fit max-w-full break-words font-display font-extrabold leading-[0.92] tracking-[-3px] text-text [font-size:clamp(64px,8vw_+_1rem,112px)]">
      {title}
      <InspectOutline variant="hover" measure selector={Heading} />
    </Heading>
    {subtitle && <p className="text-body-m text-text-muted">{subtitle}</p>}
  </div>
);
