"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { newPondFormFields, newPondSelectOptions } from "@/lib/constants";
import z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPondWithFormattedData } from "../action";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import FormFields from "./FormFields";

const newFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  initialStock: z
    .string()
    .trim()
    .min(1, "Initial stock must be a positive number"),
  type: z.string(),
  species: z.string(),
  stockingDate: z.string(),
  description: z.string(),
});

export default function NewPondForm() {
  const form = useForm({
    validators: {
      onBlur: newFormSchema,
      onSubmitAsync: async ({ value }) => {
        const result = await createPondWithFormattedData(value);

        if (result?.error) {
          console.error("Error result:", result);
          return {
            form: result.error,
          };
        }

        return null;
      },
    },
    defaultValues: {
      name: "",
      initialStock: "0",
      type: "",
      species: "",
      stockingDate: new Date().toISOString().split("T")[0],
      description: "",
    },
    onSubmit: async () => {
      redirect("/ponds");
    },
  });

  const submitError = useStore(form.store, (s) => s.errorMap.onSubmit?.form);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  return (
    <form
      id="new-pond"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-5"
    >
      {newPondFormFields.map((field) => (
        <FormFields
          key={field.name}
          form={form}
          isRequired={field.isRequired || false}
          {...field}
          selectDefaultValue="concrete"
          selectOptions={newPondSelectOptions}
        />
      ))}
      {submitError && <p className="text-destructive text-sm">{submitError}</p>}
      <div className="mt-6">
        <Link href="/ponds">
          <Button variant="outline">Cancel</Button>
        </Link>

        <Button
          disabled={!canSubmit || isSubmitting}
          type="submit"
          className="ml-2"
        >
          {isSubmitting ? (
            <>
              <Spinner /> Creating Pond...
            </>
          ) : (
            "Create Pond"
          )}
        </Button>
      </div>
    </form>
  );
}
