"use client";

import { useForm } from "@tanstack/react-form";
import { newPondFormFields } from "@/lib/constants";
import z from "zod";
import NewPondFormFields from "./NewPondFormFields";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const newFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initialStock: z.number().min(0, "Initial stock must be a positive number"),
  type: z.string(),
  species: z.string(),
  stockingDate: z.string(),
  description: z.string(),
});

export default function NewPondForm() {
  const form = useForm({
    validators: {
      onBlur: newFormSchema,
    },
    defaultValues: {
      name: "",
      initialStock: 0,
      type: "",
      species: "",
      stockingDate: new Date().toISOString().split("T")[0],
      description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("Form submitted with values:", value);
      formApi.reset();
    },
  });

  return (
    <form
      id="new-pond"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {newPondFormFields.map((field) => (
        <NewPondFormFields key={field.name} form={form} {...field} />
      ))}
      {/* {error && <p className="text-destructive text-sm">{error}</p>} */}
      <div className="mt-6">
        <Link href="/ponds">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" className="ml-2">
          Create Pond
        </Button>
      </div>
    </form>
  );
}
