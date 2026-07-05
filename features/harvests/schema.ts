import { z } from "zod";

export const newHarvestSchema = z.object({
  pond_id: z.string().uuid({ message: "Please select a pond." }),
  harvest_date: z
    .string()
    .min(1, "Harvest date is required.")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Harvest date cannot be in the future.",
    }),
  quantity_kg: z
    .string()
    .min(1, "Quantity is required.")
    .refine((val) => Number(val) > 0, {
      message: "Quantity must be greater than 0.",
    }),
  fish_count: z
    .string()
    .min(1, "Fish count is required.")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, {
      message: "Fish count must be a positive whole number.",
    }),
  revenue: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) >= 0, {
      message: "Revenue cannot be negative.",
    }),
  buyer: z.string().optional(),
  notes: z.string().optional(),
});

export type NewHarvestFormValues = z.infer<typeof newHarvestSchema>;

export function validateFishCountAgainstStock(
  fishCount: string,
  currentStock: number | null,
): string | undefined {
  if (currentStock == null) return undefined;
  const count = Number(fishCount);
  if (!Number.isNaN(count) && count > currentStock) {
    return `Only ${currentStock} fish available in this pond.`;
  }
  return undefined;
}
