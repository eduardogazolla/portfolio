import { useId } from "react";
import { cn } from "@/app/lib/utils";

type FieldMeta = { id?: string; helper?: string; error?: string; describedBy?: string };

/** Ids and aria wiring shared by Input and Textarea. */
export const useField = ({ id, helper, error, describedBy }: FieldMeta) => {
  const generated = useId();
  const fieldId = id ?? generated;
  const messageId = `${fieldId}-message`;
  const message = error ?? helper;
  return {
    fieldId,
    messageId,
    message,
    // Keep the caller's own aria-describedby alongside the helper/error id.
    describedBy: [describedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined,
    invalid: error ? true : undefined,
  };
};

// The animated underline replaces the default focus outline, hence focus:outline-none.
export const fieldClasses =
  "peer block w-full bg-transparent py-3 text-body-l text-text placeholder:text-text-muted focus:outline-none";

export const FieldLabel = ({
  htmlFor,
  error,
  children,
}: {
  htmlFor: string;
  error: boolean;
  children: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "block text-label-m transition-colors duration-fast ease-out motion-reduce:transition-none",
      error ? "text-text" : "text-text-muted group-focus-within:text-text"
    )}
  >
    {children}
  </label>
);

/** Must be rendered right after the control, which carries the `peer` class. */
export const Underline = ({ error }: { error: boolean }) => (
  <>
    <span
      aria-hidden="true"
      className={cn("absolute inset-x-0 bottom-0", error ? "h-0.5 bg-danger" : "h-px bg-line")}
    />
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0",
        error ? "bg-danger" : "bg-accent",
        "transition-transform duration-base ease-out peer-focus:scale-x-100",
        "motion-reduce:transition-none"
      )}
    />
  </>
);

export const FieldMessage = ({
  id,
  error,
  children,
}: {
  id: string;
  error: boolean;
  children?: string;
}) =>
  children ? (
    <p id={id} className={cn("text-body-m", error ? "text-danger" : "text-text-muted")}>
      {children}
    </p>
  ) : null;
