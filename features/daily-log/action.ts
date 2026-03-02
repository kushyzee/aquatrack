"use server";

import { createClient } from "@/lib/supabase/server";

interface FormDataProps {
  pondName: string;
  logDate: string;
  feedType: string;
  feedQuantity: string;
  mortalityCount: string;
  suspectedCause: string;
  temperature: string;
  pH: string;
  notes: string;
}

export async function formatFormData(
  formData: FormDataProps,
  pondId: string | undefined,
) {
  console.log(pondId, formData);

  const result = await newLogAction(formData, pondId!);

  if (result?.error && result.error.startsWith("duplicate key value")) {
    return { error: "A log already exists for this date and pond." };
  } else if (result?.error) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  console.log(result);
}

async function newLogAction(formData: FormDataProps, pondId: string) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getClaims();

  const userId = currentUser?.claims.sub;

  const { data, error } = await supabase.rpc("create_daily_log_with_entries", {
    p_pond_id: pondId,
    p_created_by: userId,
    p_log_date: formData.logDate,
    p_notes: formData.notes || null,
    p_water_temp_c: formData.temperature
      ? parseFloat(formData.temperature)
      : null,
    p_water_ph: formData.pH ? parseFloat(formData.pH) : null,
    p_feed_type: formData.feedType || null,
    p_feed_quantity_kg: formData.feedQuantity
      ? parseFloat(formData.feedQuantity)
      : null,
    p_mortality_count: formData.mortalityCount
      ? parseInt(formData.mortalityCount)
      : null,
    p_suspected_cause: formData.suspectedCause || null,
  });

  if (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return data;
}
