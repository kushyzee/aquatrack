"use client";

import { useForm } from "@tanstack/react-form";
import { newPondFormFields } from "@/lib/constants";
import z from "zod";
import NewPondFormFields from "./NewPondFormFields";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { newPondAction } from "../action";
import { redirect } from "next/navigation";

const newFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initialStock: z.string().min(0, "Initial stock must be a positive number"),
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
      initialStock: "0",
      type: "",
      species: "",
      stockingDate: new Date().toISOString().split("T")[0],
      description: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value.initialStock) {
        value.initialStock = "0";
      } else if (value.type === "") {
        value.type = "concrete";
      }

      switch (value.type) {
        case "concrete":
          value.type = "Concrete Tank";
          break;
        case "earthen":
          value.type = "Earthen Pond";
          break;
        case "plastic":
          value.type = "Plastic Tank";
          break;
        case "tarpaulin":
          value.type = "Tarpaulin Tank";
          break;
        default:
          break;
      }

      const result = await newPondAction(value);

      if (result.success) {
        formApi.reset();
        // revalidatePath("/ponds");
        redirect("/ponds");
      }
      // console.log("Form submitted with values:", value);
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
        <NewPondFormFields
          key={field.name}
          form={form}
          isRequired={field.isRequired || false}
          {...field}
        />
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
