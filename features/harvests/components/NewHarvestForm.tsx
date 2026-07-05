/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { newHarvestSchema, validateFishCountAgainstStock } from "../schema";
import { createHarvestAction } from "../action";
import { PondWithStock } from "../data";

interface NewHarvestFormProps {
  ponds: PondWithStock[];
}

function toFieldErrors(errors: unknown[]): { message?: string }[] {
  return errors.filter(Boolean).map((e) => ({
    message:
      typeof e === "string"
        ? e
        : typeof e === "object" && e !== null && "message" in e
          ? String((e as { message: unknown }).message)
          : String(e),
  }));
}

export default function NewHarvestForm({ ponds }: NewHarvestFormProps) {
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState<number | null>(null);

  const form = useForm({
    defaultValues: {
      pond_id: "",
      harvest_date: new Date().toISOString().slice(0, 10),
      quantity_kg: "",
      fish_count: "",
      revenue: "",
      buyer: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      const result = await createHarvestAction(value);

      if (result?.error) {
        toast.error(result.error);
        if (result.errorField) {
          form.setFieldMeta(result.errorField as any, (meta) => ({
            ...meta,
            errorMap: { onSubmit: result.error },
          }));
        }
        return;
      }

      toast.success("Harvest recorded.");
      router.push("/harvests");
      // router.refresh();
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
        validators={{
          onChange: newHarvestSchema.shape.pond_id,
        }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Pond <span className="text-destructive">*</span>
                </FieldLabel>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value ?? "");
                  const pond = ponds.find((p) => p.pond_id === (value ?? ""));
                  setSelectedStock(pond?.current_fish_count ?? null);
                  field.state.meta.errors = [];
                }}
                items={ponds.map((pond) => ({
                  value: pond.pond_id,
                  label: pond.pond_name,
                }))}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue placeholder="Select a pond" />
                </SelectTrigger>
                <SelectContent>
                  {ponds.map((pond) => {
                    const depleted = pond.current_fish_count <= 0;
                    return (
                      <SelectItem
                        key={pond.pond_id}
                        value={pond.pond_id}
                        disabled={depleted}
                        className={
                          depleted
                            ? "text-muted-foreground cursor-not-allowed line-through opacity-60"
                            : undefined
                        }
                      >
                        {pond.pond_name}
                        {depleted
                          ? " — no fish available"
                          : ` (${pond.current_fish_count} fish)`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
            field.state.meta.isTouched && !field.state.meta.isValid;
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
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
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
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {selectedStock != null && (
                  <p className="text-sm font-medium text-sky-600">
                    Current stock:{" "}
                    <span className="font-semibold">{selectedStock} fish</span>
                  </p>
                )}
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
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
                  step="0.01"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
            </Field>
          );
        }}
      </form.Field>

      {/* Revenue (NGN): optional */}
      <form.Field name="revenue">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Revenue (NGN)</FieldLabel>
              <Input
                id={field.name}
                type="number"
                step="0.01"
                min={0}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {/* Buyer: optional */}
      <form.Field name="buyer">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Buyer</FieldLabel>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {/* Notes: optional */}
      <form.Field name="notes">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
              <textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 placeholder:text-muted-foreground w-full min-w-0 resize-none rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {/* Actions */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="mt-6">
            <Link href="/harvests">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="ml-2"
            >
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
