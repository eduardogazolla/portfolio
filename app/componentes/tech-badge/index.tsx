import { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type TechBadgeProps = Omit<ComponentProps<"span">, "children"> & {
  name: string;
};

export const TechBadge = ({ name, className, ...props }: TechBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-line px-3 py-1 text-label-m text-text-muted",
      className
    )}
    {...props}
  >
    {name}
  </span>
);
