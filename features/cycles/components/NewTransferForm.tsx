"use client";

import { useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transferStockSchema } from "@/features/cycles/schema";
import type { FromPondOption, ToPondOption } from "@/features/cycles/data";
import { transferStockAction } from "../actions";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { toFieldErrors } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface NewTransferFormProps {
  cycleId: string;
  fromPonds: FromPondOption[];
  toPonds: ToPondOption[];
}

export default function NewTransferForm({
  cycleId,
  fromPonds,
  toPonds,
}: NewTransferFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null | undefined>(
    null,
  );

  const form = useForm({
    defaultValues: {
      fromPondId: "",
      toPondId: "",
      count: "",
      transferDate: new Date().toISOString().slice(0, 10),
      notes: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const parsed = transferStockSchema.safeParse({ cycleId, ...value });
      if (!parsed.success) {
        setServerError(parsed.error.issues[0].message);
        return;
      }

      startTransition(async () => {
        const result = await transferStockAction(parsed.data);
        if (!result.success) {
          setServerError(result.error);
          return;
        }
        toast.success("Transfer recorded");
      });
    },
  });

  const selectedFromPond = fromPonds.find(
    (p) => p.pond_id === form.state.values.fromPondId,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <form.Field
        name="fromPondId"
        validators={{
          onChange: ({ value }) =>
            !value ? "Select a source pond" : undefined,
        }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
          return (
            <Field data-invalid={isInvalid} className="space-y-2">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  From Pond <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  items={fromPonds.map((pond) => ({
                    value: pond.pond_id,
                    label: pond.pond_name,
                  }))}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={isInvalid}
                  >
                    <SelectValue placeholder="Select source pond" />
                  </SelectTrigger>
                  <SelectContent>
                    {fromPonds.map((pond) => (
                      <SelectItem key={pond.pond_id} value={pond.pond_id}>
                        {pond.pond_name} (
                        {pond.current_fish_count.toLocaleString()} fish)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
            </Field>
          );
        }}
      </form.Field>

      <form.Field
        name="toPondId"
        validators={{
          onChange: ({ value }) =>
            !value ? "Select a destination pond" : undefined,
        }}
      >
        {(field) => {
          const isInvalid =
            !field.state.meta.isValid &&
            (field.state.meta.isTouched || form.state.submissionAttempts > 0);
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>To Pond</FieldLabel>
                <Select
                  items={toPonds.map((pond) => ({
                    value: pond.pond_id,
                    label: pond.pond_name,
                  }))}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={isInvalid}
                  >
                    <SelectValue placeholder="Select destination pond" />
                  </SelectTrigger>
                  <SelectContent>
                    {toPonds
                      .filter(
                        (pond) => pond.pond_id !== form.state.values.fromPondId,
                      )
                      .map((pond) => (
                        <SelectItem
                          key={pond.pond_id}
                          value={pond.pond_id}
                          disabled={!pond.eligible}
                        >
                          {pond.pond_name}
                          {!pond.eligible ? ` — ${pond.blockedReason}` : ""}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {isInvalid && (
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                )}
              </FieldContent>
            </Field>
          );
        }}
      </form.Field>

      <form.Field
        name="count"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Enter a count";
            const num = Number(value);
            if (Number.isNaN(num) || num <= 0)
              return "Count must be greater than 0";
            if (selectedFromPond && num > selectedFromPond.current_fish_count) {
              return `Only ${selectedFromPond.current_fish_count} fish available`;
            }
            return undefined;
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
                <FieldLabel htmlFor={field.name}>Count</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  max={selectedFromPond?.current_fish_count}
                  value={field.state.value}
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

      <form.Field name="transferDate">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Transfer Date</FieldLabel>
              <Input
                id={field.name}
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Notes (optional)</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FieldContent>
          </Field>
        )}
      </form.Field>

      {serverError && <p className="text-destructive text-sm">{serverError}</p>}

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button type="submit" disabled={isSubmitting || isPending}>
            {isSubmitting || isPending ? (
              <>
                <Spinner />
                Recording...
              </>
            ) : (
              "Record Transfer"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
