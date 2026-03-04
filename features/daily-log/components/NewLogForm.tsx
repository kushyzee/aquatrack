"use client";

import { useForm, useStore } from "@tanstack/react-form";
import FormSection from "./FormSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import FormFields from "@/features/ponds/components/FormFields";
import { createDailyLog } from "../action";
import { toast } from "sonner";
import { newLogFormSchema } from "../schema";

interface NewLogFormProps {
  selectValue: string | undefined;
  pondId: string | undefined;
  pondOptions: { value: string; label: string; id?: string }[];
}

export default function NewLogForm({
  selectValue,
  pondId,
  pondOptions,
}: NewLogFormProps) {
  const form = useForm({
    validators: {
      // onChangeAsync: async ({ value, formApi }) => {
      //   if (
      //     formApi.getFieldMeta("pondName")?.isDirty ||
      //     formApi.getFieldMeta("logDate")?.isDirty
      //   ) {
      //     const selectedPondId = pondOptions.find(
      //       (pond) => pond.value === value.pondName,
      //     )?.id;
      //     console.log(value.logDate);

      //     const result = await checkLogExists(selectedPondId!, value.logDate);

      //     if (result?.exists) {
      //       toast.error("A log already exists for this date and pond.");
      //       formApi.setFieldMeta("logDate", (prev) => ({
      //         ...prev,
      //         isTouched: true,
      //       }));

      //       return {
      //         fields: {
      //           pondName: "A log already exists for this date and pond.",
      //           logDate: "A log already exists for this date and pond.",
      //         },
      //       };
      //     } else {
      //       // formApi.resetFieldMeta({});
      //     }
      //   }
      // },
      onBlur: newLogFormSchema,
      onSubmitAsync: async ({ value }) => {
        value.pondName = value.pondName
          ? value.pondName
          : selectValue || pondOptions[0]?.value;

        const selectedPondId = pondOptions.find(
          (pond) => pond.value === value.pondName,
        )?.id;

        const result = await createDailyLog(value, selectedPondId);

        if (result?.error) {
          toast.error("A log already exists for this date and pond.");
        } else {
          toast.success("Log created successfully!");
        }
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
    onSubmit({ formApi, value }) {
      console.log(value);

      formApi.resetField("mortalityCount");
      formApi.resetField("suspectedCause");
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
