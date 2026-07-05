import { z } from "zod";

export const cycleStockingSchema = z.object({
  pond_id: z.string().uuid(),
  fish_count: z
    .string()
    .min(1, "Fish count is required.")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, {
      message: "Fish count must be a positive whole number.",
    }),
});

export const newCycleSchema = z.object({
  species: z.string().min(1, "Species is required."),
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

export type NewCycleFormValues = z.infer<typeof newCycleSchema>;
