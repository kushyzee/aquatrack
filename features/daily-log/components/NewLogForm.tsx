"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import FormSection from "./FormSection";
import { createDailyLog } from "../action";
import { newLogFormSchema, type NewLogFormData } from "../schema";
import { cn, toFieldErrors } from "@/lib/utils";
import type { PondWithCycleStatus } from "@/features/ponds/data";

interface NewLogFormProps {
  preselectedPondId?: string;
  backHref: string;
  pondOptions: PondWithCycleStatus[];
}

type ServerErrors = Partial<Record<keyof NewLogFormData, string>>;

export default function NewLogForm({
  preselectedPondId,
  backHref,
  pondOptions,
}: NewLogFormProps) {
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});
  const today = new Date().toISOString().split("T")[0];

  const form = useForm({
    defaultValues: {
      pondId: preselectedPondId ?? "",
      logDate: today,
      feedType: "",
      feedQuantity: "",
      mortalityCount: "",
      suspectedCause: "",
      temperature: "",
      pH: "",
      notes: "",
    } as NewLogFormData,
    onSubmit: async ({ value, formApi }) => {
      const result = await createDailyLog(value);

      if (result?.error) {
        if (result.errorField) {
          setServerErrors({ [result.errorField]: result.error });
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Log created successfully!");
      formApi.reset();
      if (preselectedPondId) {
        formApi.setFieldValue("pondId", preselectedPondId);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {/* Pond */}
      <form.Field
        name="pondId"
        validators={{ onChange: newLogFormSchema.shape.pondId }}
      >
        {(field) => {
          const isInvalid =
            (!field.state.meta.isValid &&
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0)) ||
            Boolean(serverErrors.pondId);

          const displayErrors = serverErrors.pondId
            ? [{ message: serverErrors.pondId }]
            : toFieldErrors(field.state.meta.errors);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Pond <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value ?? "");
                    if (serverErrors.pondId) {
                      setServerErrors((prev) => ({
                        ...prev,
                        pondId: undefined,
                      }));
                    }
                  }}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select a pond" />
                  </SelectTrigger>
                  <SelectContent>
                    {pondOptions.map((pond) => (
                      <SelectItem
                        key={pond.id}
                        value={pond.id}
                        disabled={!pond.cycleId}
                      >
                        {pond.name}
                        {!pond.cycleId ? " (No active cycle)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
              {isInvalid && <FieldError errors={displayErrors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Date */}
      <form.Field
        name="logDate"
        validators={{ onChange: newLogFormSchema.shape.logDate }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Date <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
              </FieldContent>
              {isInvalid && (
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              )}
            </Field>
          );
        }}
      </form.Field>

      <FormSection title="Feed">
        <form.Field name="feedType">
          {(field) => (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Local feed, blue crown"
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field
          name="feedQuantity"
          validators={{ onChange: newLogFormSchema.shape.feedQuantity }}
        >
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || form.state.submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Quantity (kg)</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="0.0"
                  />
                </FieldContent>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </Field>
            );
          }}
        </form.Field>
      </FormSection>

      <FormSection title="Mortality">
        <form.Field
          name="mortalityCount"
          validators={{ onChange: newLogFormSchema.shape.mortalityCount }}
        >
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || form.state.submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Count</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="0"
                  />
                </FieldContent>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="suspectedCause">
          {(field) => (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Suspected Cause</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Disease, poor water quality"
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>
      </FormSection>

      <FormSection title="Water Observations">
        <form.Field
          name="temperature"
          validators={{ onChange: newLogFormSchema.shape.temperature }}
        >
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || form.state.submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Temperature (°C)</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="e.g., 28.5"
                  />
                </FieldContent>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="pH"
          validators={{ onChange: newLogFormSchema.shape.pH }}
        >
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid &&
              (field.state.meta.isTouched || form.state.submissionAttempts > 0);

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>pH</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="e.g., 6.5"
                  />
                </FieldContent>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </Field>
            );
          }}
        </form.Field>
      </FormSection>

      <form.Field name="notes">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Additional observations..."
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      <div className="mt-6 flex gap-2">
        <Link
          href={backHref}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Cancel
        </Link>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button disabled={!canSubmit || isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Spinner /> Saving Log...
                </>
              ) : (
                "Save Log"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
