import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface PondWithCycleStatus {
  id: string;
  name: string;
  code: string | null;
  status: string;
  cycleId: string | null;
  species: string | null;
  currentFishCount: number;
}

export async function getPondsWithCycleStatus(): Promise<
  PondWithCycleStatus[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pond_current_stock")
    .select(
      "pond_id, pond_name, pond_code, status, cycle_id, species, current_fish_count",
    )
    .eq("status", "active")
    .order("pond_name");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((p) => ({
    id: p.pond_id,
    name: p.pond_name,
    code: p.pond_code,
    status: p.status,
    cycleId: p.cycle_id,
    species: p.species,
    currentFishCount: p.current_fish_count,
  }));
}

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

export async function getPondDailyLog(pondId: string) {
  const supabase = await createClient();

  const { data: initialLogs, error } = await supabase
    .from("pond_daily_log")
    .select("*")
    .eq("pond_id", pondId)
    .order("log_date", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Error fetching pond daily logs:", error);
    throw new Error(`Failed to fetch pond daily logs: ${error.message}`);
  }

  return initialLogs;
}

export async function getHarvestHistory(pondId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("harvests")
    .select("*")
    .eq("pond_id", pondId)
    .order("harvest_date", { ascending: false });

  if (error) {
    console.error("Error fetching pond daily logs:", error);
    throw new Error(`Failed to fetch pond daily logs: ${error.message}`);
  }

  return data;
}
