import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function fetchPonds() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ponds")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ponds:", error);
    throw new Error(`Failed to fetch ponds: ${error.message}`);
  }

  return data;
}

export async function getPondStockSummary(pondId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pond_current_stock")
    .select("*")
    .eq("pond_id", pondId)
    .single();

  if (error) {
    console.error("Error fetching pond stock summary:", error);
    throw new Error(`Failed to fetch pond stock summary: ${error.message}`);
  }

  return data;
}
