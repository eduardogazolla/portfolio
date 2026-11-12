import NextLink from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
    /** Disables the button, sets aria-busy and shows a spinner. Pass the loading text as children. */
    loading?: boolean;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    loading?: undefined;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const hoverFinePointer = "[@media(hover:hover)_and_(pointer:fine)]:hover";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-label-m " +
  "transition-transform duration-fast ease-out " +
  "active:scale-[0.97] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: `bg-accent text-on-accent ${hoverFinePointer}:bg-text`,
  secondary: `border border-line text-text ${hoverFinePointer}:border-text`,
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const Button = (props: ButtonProps) => {
  if (props.href !== undefined) {
    const { variant = "primary", className, href, target, rel, children, ...rest } = props;
    const classes = cn(base, variants[variant], className);

    if (isExternal(href) || target === "_blank") {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : rel}
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <NextLink href={href} target={target} rel={rel} className={classes} {...rest}>
        {children}
      </NextLink>
    );
  }

  const {
    variant = "primary",
    className,
    loading = false,
    disabled,
    type = "button",
    children,
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          data-spinner
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
        />
      )}
      {children}
    </button>
  );
};
