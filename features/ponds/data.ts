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
