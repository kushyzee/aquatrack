import "server-only";

import { createClient } from "@/lib/supabase/server";
import { PondStatus } from "@/lib/types";

export interface PondWithCycleStatus {
  id: string;
  name: string;
  code: string | null;
  status: PondStatus;
  type: string;
  cycleId: string | null;
  species: string | null;
  currentFishCount: number;
}

export interface PondInsightsPoint {
  logDate: string;
  feedKg: number;
  mortality: number;
}

export async function getPondInsights(pondId: string): Promise<{
  cycleId: string | null;
  points: PondInsightsPoint[];
}> {
  const supabase = await createClient();

  const { data: currentStock, error: stockError } = await supabase
    .from("pond_current_stock")
    .select("cycle_id")
    .eq("pond_id", pondId)
    .single();

  if (stockError) {
    console.error(
      "Error fetching pond current stock for insights:",
      stockError,
    );
    throw new Error(`Failed to fetch pond insights: ${stockError.message}`);
  }

  let cycleId: string | null = currentStock?.cycle_id ?? null;

  if (!cycleId) {
    const { data: pondCycles, error: pondCyclesError } = await supabase
      .from("pond_cycle_stock")
      .select("cycle_id")
      .eq("pond_id", pondId);

    if (pondCyclesError) {
      console.error(
        "Error fetching pond cycle history for insights:",
        pondCyclesError,
      );
      throw new Error(
        `Failed to fetch pond insights: ${pondCyclesError.message}`,
      );
    }

    const cycleIds = (pondCycles ?? []).map((r) => r.cycle_id);

    if (cycleIds.length > 0) {
      const { data: mostRecentCompleted, error: completedError } =
        await supabase
          .from("production_cycles")
          .select("id")
          .in("id", cycleIds)
          .eq("status", "completed")
          .order("end_date", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (completedError) {
        console.error(
          "Error resolving most recent completed cycle:",
          completedError,
        );
        throw new Error(
          `Failed to fetch pond insights: ${completedError.message}`,
        );
      }

      cycleId = mostRecentCompleted?.id ?? null;
    }
  }

  if (!cycleId) {
    return { cycleId: null, points: [] };
  }

  const { data: logs, error: logsError } = await supabase
    .from("pond_daily_log")
    .select("log_date, feed_kg_total, mortality_total")
    .eq("pond_id", pondId)
    .eq("cycle_id", cycleId)
    .order("log_date", { ascending: true });

  if (logsError) {
    console.error("Error fetching daily logs for insights:", logsError);
    throw new Error(`Failed to fetch pond insights: ${logsError.message}`);
  }

  const points: PondInsightsPoint[] = (logs ?? []).map((l) => ({
    logDate: l.log_date,
    feedKg: Math.round(Number(l.feed_kg_total ?? 0) * 10) / 10,
    mortality: l.mortality_total ?? 0,
  }));

  return { cycleId, points };
}

export async function getPondsWithCycleStatus({
  activeOnly = true,
}: { activeOnly?: boolean } = {}): Promise<PondWithCycleStatus[]> {
  const supabase = await createClient();

  let query = supabase
    .from("pond_current_stock")
    .select(
      "pond_id, pond_name, pond_code, status, type, cycle_id, species, current_fish_count",
    );

  query = activeOnly
    ? query.eq("status", "active").order("pond_name", { ascending: true })
    : query
        .order("status", { ascending: true })
        .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching ponds with cycle status:", error);
    throw new Error(`Failed to fetch ponds: ${error.message}`);
  }

  return (data ?? []).map((p) => ({
    id: p.pond_id,
    name: p.pond_name,
    code: p.pond_code,
    status: p.status,
    type: p.type,
    cycleId: p.cycle_id,
    species: p.species,
    currentFishCount: p.current_fish_count,
  }));
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
    console.error("Error fetching harvest history:", error);
    throw new Error(`Failed to fetch harvest history: ${error.message}`);
  }

  return data;
}
