import type { Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";
import { FieldLabel, FieldMessage, Underline, fieldClasses, useField } from "./field";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label: string;
  helper?: string;
  error?: string;
  id?: string;
  ref?: Ref<HTMLTextAreaElement>;
};

export const Textarea = ({ label, helper, error, id, className, ref, rows = 4, ...props }: TextareaProps) => {
  const field = useField({ id, helper, error });

  return (
    <div className="w-full">
      <FieldLabel htmlFor={field.fieldId}>{label}</FieldLabel>
      <div className="relative">
        <textarea
          {...props}
          ref={ref}
          rows={rows}
          id={field.fieldId}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          className={cn(fieldClasses, "resize-y", className)}
        />
        <Underline error={!!error} />
      </div>
      <FieldMessage id={field.messageId} error={!!error}>
        {field.message}
      </FieldMessage>
    </div>
  );
};
