import "server-only";

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

  return Number(data.total_fish_in_farm);
}

export async function getFeedUsedRollups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feed_used_rollups")
    .select("feed_kg_7d, feed_kg_30d")
    .single();

  if (error) {
    console.error("Error fetching recent feed quantity:", error);
    throw new Error(`Error getting total feed used rollups: ${error.message}`);
  }

  return {
    feed7d: Number(data.feed_kg_7d ?? 0),
    feed30d: Number(data.feed_kg_30d ?? 0),
  };
}

export async function getMortalityRollups() {
  const { data, error } = await supabase
    .from("mortality_rollups")
    .select("mortality_7d, mortality_30d")
    .single();

  if (error) {
    console.error("Error fetching mortality rollups:", error);

    throw new Error(`getMortalityRollups: ${error.message}`);
  }

  return {
    mortality7d: Number(data.mortality_7d ?? 0),
    mortality30d: Number(data.mortality_30d ?? 0),
  };
}

export async function getHarvestMtdRollup() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("harvest_mtd_rollup")
    .select("harvest_kg_mtd, harvest_fish_mtd")
    .single();

  if (error) {
    console.error("Error fetching harvest MTD rollup:", error);

    throw new Error(`getHarvestMtdRollup: ${error.message}`);
  }

  return {
    kg: Number(data.harvest_kg_mtd ?? 0),
    fish: Number(data.harvest_fish_mtd ?? 0),
  };
}

export async function getPondsWithHighMortality() {
  const { data, error } = await supabase
    .from("pond_mortality_7d")
    .select("pond_name, mortality_last_7d")
    .eq("status", "active")
    .gte("mortality_last_7d", 40) // Example threshold for high mortality
    .order("mortality_last_7d", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching ponds with high mortality:", error);
    throw new Error(`getPondsWithHighMortality: ${error.message}`);
  }

  return data;
}

export async function getDashboardMetrics() {
  const [
    totalFishInFarm,
    feedUsed,
    mortality,
    harvestMtd,
    pondsWithHighMortality,
  ] = await Promise.all([
    getTotalFishInFarm(),
    getFeedUsedRollups(),
    getMortalityRollups(),
    getHarvestMtdRollup(),
    getPondsWithHighMortality(),
  ]);

  return {
    totalFishInFarm,
    feedUsed,
    mortality,
    harvestMtd,
    pondsWithHighMortality,
  };
}
