"use client";

import { useForm, useStore } from "@tanstack/react-form";
import z from "zod";
import FormSection from "./FormSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FormFields from "@/features/ponds/components/FormFields";

interface NewLogFormProps {
  selectValue: string | undefined;
  pondId: string | undefined;
  pondOptions: { value: string; label: string; id?: string }[];
}

const newLogFormSchema = z.object({
  pondName: z.string(),
  logDate: z.string(),
  feedType: z.string(),
  feedQuantity: z.string(),
  mortalityCount: z.string(),
  suspectedCause: z.string(),
  temperature: z.string(),
  pH: z.string(),
  notes: z.string(),
});

export default function NewLogForm({
  selectValue,
  pondId,
  pondOptions,
}: NewLogFormProps) {
  const form = useForm({
    validators: {
      onBlur: newLogFormSchema,
      onSubmitAsync: async ({ value }) => {
        console.log("Form submitted with values:", value);
        // Here you would typically send the data to your backend API
      },
    },
    defaultValues: {
      pondName: "",
      logDate: new Date().toISOString().split("T")[0],
      feedType: "",
      feedQuantity: "",
      mortalityCount: "",
      suspectedCause: "",
      temperature: "",
      pH: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      value.pondName = value.pondName
        ? value.pondName
        : selectValue || pondOptions[0]?.value;

      console.log(value.pondName);

      const selectedPondId = selectValue
        ? pondId
        : pondOptions.find((pond) => pond.value === value.pondName)?.id;
      console.log("Pond id:", selectedPondId);
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  return (
    <form
      id="new-log"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-5"
    >
      <FormFields
        form={form}
        name="pondName"
        label="Pond"
        isRequired={true}
        type="select"
        selectDefaultValue={selectValue || pondOptions[0]?.value}
        selectOptions={pondOptions}
      />
      <FormFields
        form={form}
        name="logDate"
        label="Date"
        isRequired={false}
        type="date"
      />
      <FormSection title="Feed">
        <FormFields
          form={form}
          name="feedType"
          label="Type"
          isRequired={false}
          type="text"
          placeholder="e.g., Local feed, blue crown"
        />
        <FormFields
          form={form}
          name="feedQuantity"
          label="Quantity (kg)"
          isRequired={false}
          type="number"
          placeholder="0.0"
        />
      </FormSection>
      <FormSection title="Mortality">
        <FormFields
          form={form}
          name="mortalityCount"
          label="Count"
          isRequired={false}
          type="number"
          placeholder="0"
        />
        <FormFields
          form={form}
          name="suspectedCause"
          label="Suspected Cause"
          isRequired={false}
          type="text"
          placeholder="e.g., Disease, poor water quality"
        />
      </FormSection>
      <FormSection title="Water Observations">
        <FormFields
          form={form}
          name="temperature"
          label="Temperature (°C)"
          isRequired={false}
          type="number"
          placeholder="e.g., 28.5"
        />
        <FormFields
          form={form}
          name="pH"
          label="pH"
          isRequired={false}
          type="number"
          placeholder="e.g., 6.5"
        />
      </FormSection>
      <FormFields
        form={form}
        name="notes"
        label="Notes"
        isRequired={false}
        type="text"
        placeholder="Additional observations..."
      />
      <div className="mt-6">
        <Link href={selectValue ? `/ponds/${pondId}` : "/ponds"}>
          <Button variant="outline">Cancel</Button>
        </Link>

        <Button
          disabled={!canSubmit || isSubmitting}
          type="submit"
          className="ml-2"
        >
          {isSubmitting ? (
            <>
              <Spinner /> Saving Log...
            </>
          ) : (
            "Save Log"
          )}
        </Button>
      </div>
    </form>
  );
}
