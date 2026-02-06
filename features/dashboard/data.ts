import { createClient } from "@/lib/supabase/server";

export async function getTotalFishInFarm() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("farm_total_fish")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching total fish in farm:", error);
    return null;
  }

  return data.total_fish_in_farm as number;
}
