import { Controller, type Control, type FieldPath } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ActivitySchema } from "@/lib/schemas/activitySchema";

// Excludes "date" (handled by ActivityDateField's popover/calendar UI, not a plain
// input) - keeping it out of the union here is what lets `field.value` below narrow
// to `string | number` instead of widening to include `Date`.
type TextFieldName = Exclude<FieldPath<ActivitySchema>, "date">;

type Props = {
  name: TextFieldName;
  control: Control<ActivitySchema>;
  label: string;
  id: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
};

export function FormTextField({
  name,
  control,
  label,
  id,
  type = "text",
  placeholder,
  className,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
