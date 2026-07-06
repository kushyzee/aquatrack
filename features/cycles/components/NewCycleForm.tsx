"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { newCycleSchema } from "../schema";
import { AvailablePond } from "../data";
import { createCycleAction } from "../actions";
import { toFieldErrors } from "@/lib/utils";

interface NewCycleFormProps {
  ponds: AvailablePond[];
}

export default function NewCycleForm({ ponds }: NewCycleFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      species: "",
      start_date: new Date().toISOString().slice(0, 10),
      stockings: [{ pond_id: "", fish_count: "" }] as {
        pond_id: string;
        fish_count: string;
      }[],
    },
    onSubmit: async ({ value }) => {
      const result = await createCycleAction(value);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Production cycle started.");
      router.push("/cycles");
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
      {/* Species */}
      <form.Field
        name="species"
        validators={{ onChange: newCycleSchema.shape.species }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Species <span className="text-destructive">*</span>
                </FieldLabel>

                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="e.g. Catfish"
                />
              </FieldContent>
              {isInvalid && (
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              )}
            </Field>
          );
        }}
      </form.Field>

      {/* Start Date */}
      <form.Field
        name="start_date"
        validators={{ onChange: newCycleSchema.shape.start_date }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Start Date <span className="text-destructive">*</span>
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

      {/* Stockings (dynamic pond + fish_count rows) */}
      <form.Field name="stockings" mode="array">
        {(stockingsField) => {
          const stockingsInvalid =
            !stockingsField.state.meta.isValid &&
            (stockingsField.state.meta.isTouched ||
              form.state.submissionAttempts > 0);

          return (
            <div className="space-y-3">
              <FieldLabel>
                Initial Stocking <span className="text-destructive">*</span>
              </FieldLabel>

              {stockingsInvalid && (
                <FieldError
                  errors={toFieldErrors(stockingsField.state.meta.errors)}
                />
              )}

              {stockingsField.state.value.map((_, index) => {
                const selectedElsewhere = stockingsField.state.value
                  .filter((_, i) => i !== index)
                  .map((s) => s.pond_id);

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-5 rounded-md border p-3 sm:flex-row sm:items-start"
                  >
                    {/* Pond */}
                    <div className="flex-1">
                      <form.Field
                        name={`stockings[${index}].pond_id`}
                        validators={{
                          onChange:
                            newCycleSchema.shape.stockings.element.shape
                              .pond_id,
                        }}
                      >
                        {(field) => {
                          const isInvalid =
                            !field.state.meta.isValid &&
                            (field.state.meta.isTouched ||
                              form.state.submissionAttempts > 0);
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldContent>
                                <FieldLabel htmlFor={field.name}>
                                  Pond
                                </FieldLabel>
                                <Select
                                  items={ponds.map((pond) => ({
                                    value: pond.pond_id,
                                    label: pond.pond_name,
                                  }))}
                                  value={field.state.value}
                                  onValueChange={(val) =>
                                    field.handleChange(val ?? "")
                                  }
                                >
                                  <SelectTrigger
                                    id={field.name}
                                    aria-invalid={isInvalid}
                                    className="w-full"
                                  >
                                    <SelectValue placeholder="Select a pond" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ponds
                                      .filter(
                                        (p) =>
                                          !selectedElsewhere.includes(
                                            p.pond_id,
                                          ),
                                      )
                                      .map((pond) => (
                                        <SelectItem
                                          key={pond.pond_id}
                                          value={pond.pond_id}
                                        >
                                          {pond.pond_name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </FieldContent>

                              {isInvalid && (
                                <FieldError
                                  errors={toFieldErrors(
                                    field.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                    </div>

                    {/* Fish Count */}
                    <div className="flex-1">
                      <form.Field
                        name={`stockings[${index}].fish_count`}
                        validators={{
                          onChange:
                            newCycleSchema.shape.stockings.element.shape
                              .fish_count,
                        }}
                      >
                        {(field) => {
                          const isInvalid =
                            !field.state.meta.isValid &&
                            (field.state.meta.isTouched ||
                              form.state.submissionAttempts > 0);
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldContent>
                                <FieldLabel htmlFor={field.name}>
                                  Fish Count
                                </FieldLabel>
                                <Input
                                  id={field.name}
                                  type="number"
                                  min={1}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  aria-invalid={isInvalid}
                                />
                              </FieldContent>
                              {isInvalid && (
                                <FieldError
                                  errors={toFieldErrors(
                                    field.state.meta.errors,
                                  )}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className=""
                      disabled={stockingsField.state.value.length <= 1}
                      onClick={() => stockingsField.removeValue(index)}
                      aria-label="Remove pond"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  stockingsField.pushValue({ pond_id: "", fish_count: "" })
                }
                disabled={stockingsField.state.value.length >= ponds.length}
              >
                <Plus className="h-4 w-4" /> Add Pond
              </Button>
            </div>
          );
        }}
      </form.Field>

      {/* Actions */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="mt-6 flex gap-2">
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <p className="flex items-center gap-2">
                  <Spinner />
                  <span>Starting Cycle...</span>
                </p>
              ) : (
                "Start Cycle"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
