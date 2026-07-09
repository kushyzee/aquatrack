"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { addStockSchema } from "@/features/cycles/schema";
import type { AvailablePond } from "@/features/cycles/data";
import { addStockToCycleAction } from "../actions";
import { Spinner } from "@/components/ui/spinner";

interface AddStockDialogProps {
  cycleId: string;
  ponds: AvailablePond[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toFieldErrors(errors: unknown): { message: string }[] {
  if (!Array.isArray(errors)) return [];
  return errors
    .map((e) => (typeof e === "string" ? e : e?.message))
    .filter((message): message is string => Boolean(message))
    .map((message) => ({ message }));
}

export default function AddStockDialog({
  cycleId,
  ponds,
  open,
  onOpenChange,
}: AddStockDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      stocking_date: new Date().toISOString().slice(0, 10),
      stockings: [{ pond_id: "", fish_count: "" }] as {
        pond_id: string;
        fish_count: string;
      }[],
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await addStockToCycleAction({
          cycle_id: cycleId,
          ...value,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Stock added to cycle.");
        onOpenChange(false);
        form.reset();
        router.refresh();
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95svh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Stock to Cycle</DialogTitle>
          <DialogDescription>
            Record a new batch of fish entering one or more ponds in this cycle.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
            <form.Field
              name="stocking_date"
              validators={{ onChange: addStockSchema.shape.stocking_date }}
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
                        Stocking Date{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError
                          errors={toFieldErrors(field.state.meta.errors)}
                        />
                      )}
                    </FieldContent>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="stockings" mode="array">
              {(stockingsField) => {
                const stockingsInvalid =
                  !stockingsField.state.meta.isValid &&
                  (stockingsField.state.meta.isTouched ||
                    form.state.submissionAttempts > 0);

                return (
                  <div className="space-y-3">
                    <FieldLabel>
                      Ponds <span className="text-destructive">*</span>
                    </FieldLabel>

                    {stockingsField.state.value.map((_, index) => {
                      const selectedElsewhere = stockingsField.state.value
                        .filter((_, i) => i !== index)
                        .map((s) => s.pond_id);

                      return (
                        <div
                          key={index}
                          className="flex flex-col gap-2 rounded-md border p-3"
                        >
                          <div className="space-y-5">
                            {/* pond select */}
                            <div>
                              <form.Field
                                name={`stockings[${index}].pond_id`}
                                validators={{
                                  onChange:
                                    addStockSchema.shape.stockings.element.shape
                                      .pond_id,
                                }}
                              >
                                {(field) => {
                                  const isInvalid =
                                    !field.state.meta.isValid &&
                                    (field.state.meta.isTouched ||
                                      form.state.submissionAttempts > 0);
                                  return (
                                    <Field
                                      data-invalid={isInvalid}
                                      className="gap-1"
                                    >
                                      <FieldContent>
                                        <FieldLabel htmlFor={field.name}>
                                          Pond
                                        </FieldLabel>
                                      </FieldContent>
                                      <Select
                                        items={ponds.map((pond) => ({
                                          label: pond.pond_name,
                                          value: pond.pond_id,
                                        }))}
                                        value={field.state.value}
                                        onValueChange={(value) =>
                                          field.handleChange(value ?? "")
                                        }
                                      >
                                        <SelectTrigger
                                          id={field.name}
                                          aria-invalid={isInvalid}
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
                                      {stockingsInvalid && (
                                        <FieldError
                                          errors={toFieldErrors(
                                            stockingsField.state.meta.errors,
                                          )}
                                        />
                                      )}
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

                            {/* fish count */}
                            <div>
                              <form.Field
                                name={`stockings[${index}].fish_count`}
                                validators={{
                                  onChange:
                                    addStockSchema.shape.stockings.element.shape
                                      .fish_count,
                                }}
                              >
                                {(field) => {
                                  const isInvalid =
                                    !field.state.meta.isValid &&
                                    (field.state.meta.isTouched ||
                                      form.state.submissionAttempts > 0);
                                  return (
                                    <Field
                                      data-invalid={isInvalid}
                                      className="gap-1"
                                    >
                                      <FieldContent>
                                        <FieldLabel htmlFor={field.name}>
                                          Fish Count
                                        </FieldLabel>
                                      </FieldContent>
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
                        stockingsField.pushValue({
                          pond_id: "",
                          fish_count: "",
                        })
                      }
                      disabled={
                        stockingsField.state.value.length >= ponds.length
                      }
                    >
                      <Plus className="h-4 w-4" /> Add Pond
                    </Button>
                  </div>
                );
              }}
            </form.Field>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) =>
                [state.canSubmit, state.isSubmitting] as const
              }
            >
              {([canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? (
                    <>
                      <Spinner /> Adding...
                    </>
                  ) : (
                    "Add Stock"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
