"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkLogExists(pondId: string, logDate: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("pond_id", pondId)
    .eq("log_date", logDate)
    .single();

  if (error) {
    console.error("Error checking log existence:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }

  return { exists: !!data };
}
