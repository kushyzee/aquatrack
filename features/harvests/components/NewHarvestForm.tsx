"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import Link from "next/link";
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
import { createHarvestAction } from "../action";
import { newHarvestSchema, validateFishCountAgainstStock } from "../schema";
import { cn, toFieldErrors } from "@/lib/utils";
import type { PondWithCycleStatus } from "@/features/ponds/data";

interface NewHarvestFormProps {
  ponds: PondWithCycleStatus[];
}

interface FormValues {
  pond_id: string;
  harvest_date: string;
  quantity_kg: string;
  fish_count: string;
  revenue: string;
  buyer: string;
  notes: string;
}

type ServerErrors = Partial<Record<keyof FormValues, string>>;

export default function NewHarvestForm({ ponds }: NewHarvestFormProps) {
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});

  const form = useForm({
    defaultValues: {
      pond_id: "",
      harvest_date: new Date().toISOString().slice(0, 10),
      quantity_kg: "",
      fish_count: "",
      revenue: "",
      buyer: "",
      notes: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      const result = await createHarvestAction(value);

      if (result?.error) {
        if (result.errorField) {
          setServerErrors({ [result.errorField]: result.error });
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Harvest recorded.");
      router.push("/harvests");
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
        name="pond_id"
        validators={{ onChange: newHarvestSchema.shape.pond_id }}
      >
        {(field) => {
          const isInvalid =
            (!field.state.meta.isValid &&
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0)) ||
            Boolean(serverErrors.pond_id);

          const displayErrors = serverErrors.pond_id
            ? [{ message: serverErrors.pond_id }]
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
                    if (serverErrors.pond_id) {
                      setServerErrors((prev) => ({
                        ...prev,
                        pond_id: undefined,
                      }));
                    }
                    const pond = ponds.find((p) => p.id === (value ?? ""));
                    setSelectedStock(pond?.currentFishCount ?? null);
                  }}
                  items={ponds.map((pond) => ({
                    value: pond.id,
                    label: pond.name,
                  }))}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select a pond" />
                  </SelectTrigger>
                  <SelectContent>
                    {ponds.map((pond) => {
                      const depleted = pond.currentFishCount <= 0;
                      const reason = !pond.cycleId
                        ? "no active cycle"
                        : "no fish available";

                      return (
                        <SelectItem
                          key={pond.id}
                          value={pond.id}
                          disabled={depleted}
                          className={
                            depleted
                              ? "text-muted-foreground cursor-not-allowed line-through opacity-60"
                              : undefined
                          }
                        >
                          {pond.name}
                          {depleted
                            ? ` — ${reason}`
                            : ` (${pond.currentFishCount} fish)`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FieldContent>
              {isInvalid && <FieldError errors={displayErrors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Harvest Date */}
      <form.Field
        name="harvest_date"
        validators={{ onChange: newHarvestSchema.shape.harvest_date }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Harvest Date <span className="text-destructive">*</span>
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

      {/* Quantity (kg) */}
      <form.Field
        name="quantity_kg"
        validators={{ onChange: newHarvestSchema.shape.quantity_kg }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Quantity (kg) <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={0}
                  step="0.1"
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

      {/* Fish Count */}
      <form.Field
        name="fish_count"
        validators={{
          onChange: ({ value }) =>
            newHarvestSchema.shape.fish_count.safeParse(value).success
              ? validateFishCountAgainstStock(value, selectedStock)
              : "Fish count must be a positive whole number.",
        }}
      >
        {(field) => {
          const isInvalid =
            (!field.state.meta.isValid &&
              (field.state.meta.isTouched ||
                form.state.submissionAttempts > 0)) ||
            Boolean(serverErrors.fish_count);

          const displayErrors = serverErrors.fish_count
            ? [{ message: serverErrors.fish_count }]
            : toFieldErrors(field.state.meta.errors);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Fish Count <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (serverErrors.fish_count) {
                      setServerErrors((prev) => ({
                        ...prev,
                        fish_count: undefined,
                      }));
                    }
                  }}
                  aria-invalid={isInvalid}
                />
                {selectedStock != null && (
                  <p className="text-sm font-medium text-sky-600">
                    Current stock:{" "}
                    <span className="font-semibold">{selectedStock} fish</span>
                  </p>
                )}
              </FieldContent>
              {isInvalid && <FieldError errors={displayErrors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Revenue */}
      <form.Field
        name="revenue"
        validators={{
          onChange: ({ value }) => {
            const result = newHarvestSchema.shape.revenue.safeParse(value);
            return result.success
              ? undefined
              : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);

          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Revenue (NGN)</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Optional"
                />
              </FieldContent>
              {isInvalid && (
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              )}
            </Field>
          );
        }}
      </form.Field>

      {/* Buyer */}
      <form.Field name="buyer">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Buyer</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Optional"
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {/* Notes */}
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
                placeholder="Optional"
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="mt-6 flex gap-2">
            <Link
              href="/harvests"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Recording...
                </>
              ) : (
                "Record Harvest"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
