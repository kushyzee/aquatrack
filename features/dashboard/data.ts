import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
export async function getTotalFishInFarm() {
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

export async function getRecentFeedQuantity() {
  const { data } = await supabase
    .from("feed_entries")
    .select("quantity_kg")
    .order("created_at", { ascending: false })
    .limit(7);
  return data;
}

export async function getRecentMortality() {
  const { data } = await supabase
    .from("mortality_entries")
    .select("count")
    .order("created_at", { ascending: false })
    .limit(7);
  return data;
}

export async function getHarvestData() {
  const { data } = await supabase
    .from("harvests")
    .select("quantity_kg")
    .order("created_at", { ascending: false })
    .limit(30);
  return data;
}
