import type { Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";
import { FieldLabel, FieldMessages, Underline, fieldClasses, useField } from "./field";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label: string;
  helper?: string;
  error?: string;
  id?: string;
  ref?: Ref<HTMLTextAreaElement>;
};

export const Textarea = ({ label, helper, error, id, className, ref, rows = 3, ...props }: TextareaProps) => {
  const field = useField({ id, helper, error, describedBy: props["aria-describedby"] });

  return (
    <div className="group flex w-full flex-col gap-2.5">
      <FieldLabel htmlFor={field.fieldId} error={!!error}>{label}</FieldLabel>
      <div className="relative">
        <textarea
          {...props}
          ref={ref}
          rows={rows}
          id={field.fieldId}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          className={cn(fieldClasses, "min-h-32 resize-y", className)}
        />
        <Underline error={!!error} />
      </div>
      <FieldMessages errorId={field.errorId} helperId={field.helperId} error={error} helper={helper} />
    </div>
  );
};
