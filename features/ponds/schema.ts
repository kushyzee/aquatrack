import { z } from "zod";

export const PondTypeEnum = z.enum([
  "Concrete",
  "Earthen",
  "Plastic",
  "Tarpaulin",
]);

export const PondSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Pond name must be at least 2 characters." })
    .max(100, { message: "Pond name must be under 100 characters." }),
  type: PondTypeEnum,
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must be under 500 characters." })
    .optional()
    .or(z.literal("")),
});

export type PondFormInput = z.infer<typeof PondSchema>;
