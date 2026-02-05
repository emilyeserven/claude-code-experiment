import type { ComponentProps } from "react";

import { Input } from "@/components/Input";
import { useFieldContext } from "@/hooks/useFormContext";

interface FormInputProps {
  label?: string;
  placeholder?: string;
  type?: ComponentProps<"input">["type"];
  className?: string;
}

function FormInput({
  label, placeholder, type, className,
}: FormInputProps) {
  const field = useFieldContext<string>();

  return (
    <div
      data-slot="field"
      className="grid gap-2"
    >
      {label
        ? (
          <label
            htmlFor={field.name}
            data-slot="label"
            className="text-sm leading-none font-medium"
          >
            {label}
          </label>
        )
        : null}
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        className={className}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
        aria-invalid={
          field.state.meta.isTouched && !field.state.meta.isValid
            ? true
            : undefined
        }
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0
        ? (
          <p
            data-slot="error"
            className="text-sm text-destructive"
          >
            {field.state.meta.errors.join(", ")}
          </p>
        )
        : null}
    </div>
  );
}

export { FormInput };
