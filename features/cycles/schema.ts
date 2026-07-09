import { z } from "zod";

export const cycleStockingSchema = z.object({
  pond_id: z.uuid({ message: "Please select a pond" }),
  fish_count: z
    .string()
    .min(1, "Fish count is required.")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, {
      message: "Fish count must be a positive whole number.",
    }),
});

export const addStockSchema = z.object({
  cycle_id: z.uuid({ message: "Invalid cycle ID" }),
  stocking_date: z
    .string()
    .min(1, "Stocking date is required.")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Stocking date cannot be in the future.",
    }),
  stockings: z
    .array(cycleStockingSchema)
    .min(1, "Select at least one pond to stock.")
    .refine(
      (stockings) =>
        new Set(stockings.map((s) => s.pond_id)).size === stockings.length,
      { message: "Each pond can only be selected once." },
    ),
});

export const newCycleSchema = z.object({
  species: z.string().trim().min(1, "Species is required."),
  start_date: z
    .string()
    .min(1, "Start date is required.")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Start date cannot be in the future.",
    }),
  stockings: z
    .array(cycleStockingSchema)
    .min(1, "Select at least one pond to stock.")
    .refine(
      (stockings) =>
        new Set(stockings.map((s) => s.pond_id)).size === stockings.length,
      { message: "Each pond can only be selected once." },
    ),
});

export const endCycleSchema = z.object({
  cycleId: z.uuid({ message: "Invalid cycle ID." }),
  endDate: z
    .string()
    .refine(
      (d) => new Date(d) <= new Date(),
      "End date can't be in the future",
    ),
});

export const transferStockSchema = z
  .object({
    cycleId: z.uuid({ message: "Invalid cycle ID" }),
    fromPondId: z.uuid({ message: "Please select a source pond" }),
    toPondId: z.uuid({ message: "Please select a destination pond" }),
    count: z.coerce
      .number()
      .int()
      .positive({ message: "Count must be a positive whole number." }),
    transferDate: z
      .string()
      .refine(
        (d) => new Date(d) <= new Date(),
        "Transfer date can't be in the future",
      ),
    notes: z.string().optional(),
  })
  .refine((data) => data.fromPondId !== data.toPondId, {
    message: "From and To ponds must be different",
    path: ["toPondId"],
  });

export type TransferStockInput = z.infer<typeof transferStockSchema>;
export type AddStockFormValues = z.infer<typeof addStockSchema>;
export type EndCycleInput = z.infer<typeof endCycleSchema>;
export type NewCycleFormValues = z.infer<typeof newCycleSchema>;
