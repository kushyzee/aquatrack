/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewPondFormFieldsProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "number" | "date" | "select";
  isRequired: boolean;
}

const selectOptions = [
  { value: "concrete", label: "Concrete Tank" },
  { value: "earthen", label: "Earthen Pond" },
  { value: "plastic", label: "Plastic Tank" },
  { value: "tarpaulin", label: "Tarpaulin Tank" },
];

export default function NewPondFormFields({
  form,
  name,
  label,
  placeholder,
  type,
  isRequired,
}: NewPondFormFieldsProps) {
  return (
    <form.Field
      name={name}
      children={(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        if (type === "select") {
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldContent>
              <Select
                items={selectOptions}
                name={field.name}
                value={field.state.value || "concrete"}
                onValueChange={field.handleChange}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          );
        }

        return (
          <Field data-invalid={isInvalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                {label}{" "}
                {isRequired && <span className="text-destructive">*</span>}
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder={placeholder}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
