"use server";

import { createClient } from "@/lib/supabase/server";
import { NewLogFormData, newLogFormSchema } from "./schema";

interface Payload {
  p_pond_id: string;
  p_log_date: string;
  p_notes: string | null;
  p_feed_type: string | null;
  p_feed_quantity_kg: number | null;
  p_mortality_count: number | null;
  p_water_temp_c: number | null;
  p_water_ph: number | null;
  p_suspected_cause: string | null;
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

export async function createDailyLog(
  formData: NewLogFormData,
  pondId: string | undefined,
) {
  console.log(pondId, formData);

  if (!pondId) {
    return { error: "Pond is required." };
  }

  const parsed = newLogFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      error: parsed.error?.issues[0].message ?? "Invalid form input.",
    };
  }

  const value = parsed.data;

  const payload = {
    p_pond_id: pondId,
    p_log_date: value.logDate,
    p_notes: formData.notes || null,
    p_water_temp_c: toNullableNumber(value.temperature),
    p_water_ph: toNullableNumber(value.pH),
    p_feed_type: formData.feedType || null,
    p_feed_quantity_kg: toNullableNumber(value.feedQuantity),
    p_mortality_count: toNullableNumber(value.mortalityCount),
    p_suspected_cause: formData.suspectedCause || null,
  };

  const result = await newLogAction(payload);

  if (result?.error?.startsWith("duplicate key value")) {
    return { error: "A log already exists for this date and pond." };
  }

  if (result?.error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  console.log(result);
}

async function newLogAction(payload: Payload) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getClaims();

  const userId = currentUser?.claims.sub;

  const { data, error } = await supabase.rpc("create_daily_log_with_entries", {
    ...payload,
    p_created_by: userId,
  });

  if (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return data;
}
