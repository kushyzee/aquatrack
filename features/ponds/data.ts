import "server-only";

import { createClient } from "@/lib/supabase/server";
import { setTimeout } from "timers/promises";

export async function fetchPonds() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("ponds").select("*");

  if (error) {
    console.error("Error fetching ponds:", error);
    throw new Error(`Failed to fetch ponds: ${error.message}`);
  }

  await setTimeout(5000); // Simulate network delay

  return data;
}
