"use server";

import { createClient } from "@/lib/supabase/server";
import { newLogFormSchema, type NewLogFormData } from "./schema";

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
): Promise<{ error?: string; errorField?: keyof NewLogFormData } | undefined> {
  const parsed = newLogFormSchema.safeParse(formData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue.message,
      errorField: firstIssue.path[0] as keyof NewLogFormData,
    };
  }

  const value = parsed.data;
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be signed in to create a log." };
  }

  const payload: Payload = {
    p_pond_id: value.pondId,
    p_log_date: value.logDate,
    p_notes: value.notes || null,
    p_water_temp_c: toNullableNumber(value.temperature),
    p_water_ph: toNullableNumber(value.pH),
    p_feed_type: value.feedType || null,
    p_feed_quantity_kg: toNullableNumber(value.feedQuantity),
    p_mortality_count: toNullableNumber(value.mortalityCount),
    p_suspected_cause: value.suspectedCause || null,
  };

  const { error } = await supabase.rpc("create_daily_log_with_entries", {
    ...payload,
    p_created_by: userId,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A log already exists for this date and pond." };
    }

    if (error.code === "P0001") {
      return {
        error: "This pond has no active cycle. Start a cycle before logging.",
        errorField: "pondId",
      };
    }

    if (error.code === "P0002") {
      console.error("Data integrity violation:", error);
      return {
        error: "A data integrity issue was detected. Please contact support.",
      };
    }

    console.error(error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
