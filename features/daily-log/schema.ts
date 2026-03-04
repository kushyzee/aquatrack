import z from "zod";

const optionalNumberString = (label: string, type: string = "") => {
  if (type === "ph") {
    return z
      .string()
      .trim()
      .refine((v) => v === "" || !Number.isNaN(Number(v)), {
        message: "pH must be a valid number",
      })
      .refine((v) => v === "" || (Number(v) >= 0 && Number(v) <= 14), {
        message: "pH must be between 0 and 14",
      });
  } else if (type === "temp") {
    return z
      .string()
      .trim()
      .refine((v) => v === "" || !Number.isNaN(Number(v)), {
        message: `${label} must be a valid number`,
      });
  } else {
    return z
      .string()
      .trim()
      .refine((v) => v === "" || !Number.isNaN(Number(v)), {
        message: `${label} must be a valid number`,
      })
      .refine((v) => v === "" || Number(v) >= 0, {
        message: `${label} cannot be negative`,
      });
  }
};

export const newLogFormSchema = z.object({
  pondName: z.string(),
  logDate: z.string(),
  feedType: z.string(),
  feedQuantity: optionalNumberString("Feed quantity"),
  mortalityCount: optionalNumberString("Mortality count"),
  suspectedCause: z.string(),
  temperature: optionalNumberString("Temperature", "temp"),
  pH: optionalNumberString("pH", "ph"),
  notes: z.string(),
});

export type NewLogFormData = z.infer<typeof newLogFormSchema>;
