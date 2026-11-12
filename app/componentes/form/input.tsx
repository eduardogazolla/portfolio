import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/app/lib/utils";
import { FieldLabel, FieldMessages, Underline, fieldClasses, useField } from "./field";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  helper?: string;
  error?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
};

export const Input = ({ label, helper, error, id, className, ref, ...props }: InputProps) => {
  const field = useField({ id, helper, error, describedBy: props["aria-describedby"] });

  return (
    <div className="group flex w-full flex-col gap-2.5">
      <FieldLabel htmlFor={field.fieldId} error={!!error}>{label}</FieldLabel>
      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={field.fieldId}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          className={cn(fieldClasses, className)}
        />
        <Underline error={!!error} />
      </div>
      <FieldMessages errorId={field.errorId} helperId={field.helperId} error={error} helper={helper} />
    </div>
  );
};
