import { useId } from "react";
import { cn } from "@/app/lib/utils";

type FieldMeta = { id?: string; helper?: string; error?: string };

/** Ids and aria wiring shared by Input and Textarea. */
export const useField = ({ id, helper, error }: FieldMeta) => {
  const generated = useId();
  const fieldId = id ?? generated;
  const messageId = `${fieldId}-message`;
  const message = error ?? helper;
  return {
    fieldId,
    messageId,
    message,
    describedBy: message ? messageId : undefined,
    invalid: error ? true : undefined,
  };
};

// The animated underline replaces the default focus outline, hence focus:outline-none.
export const fieldClasses =
  "peer block w-full bg-transparent py-2 text-body-m text-text placeholder:text-text-muted focus:outline-none";

export const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: string }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-label-m text-text-muted">
    {children}
  </label>
);

/** Must be rendered right after the control, which carries the `peer` class. */
export const Underline = ({ error }: { error: boolean }) => (
  <>
    <span
      aria-hidden="true"
      className={cn("absolute inset-x-0 bottom-0 h-px", error ? "bg-danger" : "bg-line")}
    />
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent",
        "transition-transform duration-base ease-out peer-focus:scale-x-100",
        "motion-reduce:transition-none",
        error && "hidden"
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
    <p id={id} className={cn("mt-1 text-mono-s", error ? "text-danger" : "text-text-muted")}>
      {children}
    </p>
  ) : null;
