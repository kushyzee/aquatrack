"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { PondSchema, type PondFormInput } from "../schema";
import { createPondAction } from "../action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toFieldErrors } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const POND_TYPES = PondSchema.shape.type.options;

type ServerErrors = Partial<Record<keyof PondFormInput, string>>;

export default function NewPondForm() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});

  const form = useForm({
    defaultValues: {
      name: "",
      type: "Concrete",
      description: "",
    } as PondFormInput,
    onSubmit: async ({ value }) => {
      const result = await createPondAction(value);

      if (result?.error) {
        if (result.errorField) {
          setServerErrors({ [result.errorField]: result.error });
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Pond created successfully.");
      router.push("/ponds");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Name */}
      <form.Field name="name" validators={{ onChange: PondSchema.shape.name }}>
        {(field) => {
          const isInvalid =
            (!field.state.meta.isValid &&
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0)) ||
            Boolean(serverErrors.name);

          const displayErrors = serverErrors.name
            ? [{ message: serverErrors.name }]
            : toFieldErrors(field.state.meta.errors);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Pond Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (serverErrors.name) {
                      setServerErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  aria-invalid={isInvalid}
                  placeholder="e.g. Pond A"
                />
              </FieldContent>
              {isInvalid && <FieldError errors={displayErrors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Type */}
      <form.Field name="type">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                Pond Type <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                items={POND_TYPES.map((type) => ({
                  label: type,
                  value: type,
                }))}
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as PondFormInput["type"])
                }
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select pond type" />
                </SelectTrigger>
                <SelectContent>
                  {POND_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {/* Description */}
      <form.Field
        name="description"
        validators={{ onChange: PondSchema.shape.description }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Description (optional)
                </FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Optional notes about this pond"
                />
              </FieldContent>
              {isInvalid && (
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              )}
            </Field>
          );
        }}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <p className="flex items-center gap-2">
                <Spinner />
                <span>Creating Pond...</span>
              </p>
            ) : (
              "Create Pond"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
