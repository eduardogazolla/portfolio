import NextLink from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";
import { isExternalUrl, isSchemeUrl } from "@/app/lib/url";
import { NewTabHint } from "@/app/componentes/link/new-tab-hint";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
    /**
     * Sets aria-busy and aria-disabled, shows a spinner and ignores clicks. The button is not natively
     * disabled, so a focused button keeps focus. Pass the loading text as children.
     */
    loading?: boolean;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    loading?: undefined;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-label-m " +
  "transition-transform duration-fast ease-out " +
  "active:scale-[0.97] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-progress aria-busy:opacity-100";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent [@media(hover:hover)_and_(pointer:fine)]:[&:not(:disabled):not([aria-busy=true])]:hover:bg-text",
  secondary: "border border-line text-text [@media(hover:hover)_and_(pointer:fine)]:hover:border-text",
};

export const Button = (props: ButtonProps) => {
  if (props.href !== undefined) {
    const { variant = "primary", className, href, target, rel, children, ...rest } = props;
    const classes = cn(base, variants[variant], className);

    if (isExternalUrl(href) || target === "_blank") {
      return (
        <a
          {...rest}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
          <NewTabHint />
        </a>
      );
    }
    if (isSchemeUrl(href)) {
      return (
        <a {...rest} href={href} target={target} rel={rel} className={classes}>
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
    onClick,
    type = "button",
    children,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      className={cn(base, variants[variant], className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (event) => event.preventDefault() : onClick}
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
