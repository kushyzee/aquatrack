/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AvailablePond {
  pond_id: string;
  pond_name: string;
}

export interface CycleTransfer {
  id: string;
  transfer_date: string;
  count: number;
  notes: string | null;
  from_pond_name: string;
  to_pond_name: string;
}

export interface PondCycleBreakdown {
  pond_id: string;
  pond_name: string;
  pond_code: string | null;
  stocked_in: number;
  transferred_in: number;
  transferred_out: number;
  total_mortality: number;
  total_harvested: number;
  current_fish_count: number;
}

type ResolveActiveCycleResult =
  | { data: { cycleId: string; currentFishCount: number }; error?: undefined }
  | {
      data?: undefined;
      error: "NO_ACTIVE_CYCLE" | "MULTIPLE_ACTIVE_CYCLES" | "UNKNOWN";
    };

export interface CycleLabel {
  id: string;
  species: string;
  status: "active" | "completed";
  startDate: string;
  endDate: string | null;
}

export async function getCyclesByIds(
  cycleIds: string[],
): Promise<CycleLabel[]> {
  if (cycleIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("production_cycles")
    .select("id, species, status, start_date, end_date")
    .in("id", cycleIds);

  if (error) {
    console.error("Error fetching cycles by ids:", error);
    throw new Error(`Failed to fetch cycles: ${error.message}`);
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    species: c.species,
    status: c.status,
    startDate: c.start_date,
    endDate: c.end_date,
  }));
}

export async function resolveActiveCycleForPond(
  pondId: string,
): Promise<ResolveActiveCycleResult> {
  const supabase = await createClient();

  const { data: stockRows, error: stockError } = await supabase
    .from("pond_cycle_stock")
    .select("cycle_id, current_fish_count")
    .eq("pond_id", pondId);

  if (stockError) {
    console.error(stockError);
    return { error: "UNKNOWN" };
  }

  if (!stockRows || stockRows.length === 0) {
    return { error: "NO_ACTIVE_CYCLE" };
  }

  const { data: activeCycles, error: cycleError } = await supabase
    .from("production_cycles")
    .select("id")
    .in(
      "id",
      stockRows.map((r) => r.cycle_id),
    )
    .eq("status", "active");

  if (cycleError) {
    console.error(cycleError);
    return { error: "UNKNOWN" };
  }

  if (!activeCycles || activeCycles.length === 0) {
    return { error: "NO_ACTIVE_CYCLE" };
  }

  if (activeCycles.length > 1) {
    console.error(
      "Data integrity violation: multiple active cycles for pond",
      pondId,
    );
    return { error: "MULTIPLE_ACTIVE_CYCLES" };
  }

  const activeRow = stockRows.find((r) => r.cycle_id === activeCycles[0].id);

  if (!activeRow) {
    return { error: "UNKNOWN" };
  }

  return {
    data: {
      cycleId: activeRow.cycle_id,
      currentFishCount: activeRow.current_fish_count,
    },
  };
}

export async function getCycleById(
  cycleId: string,
): Promise<CycleSummary | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cycle_summary")
    .select("*")
    .eq("cycle_id", cycleId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getPondBreakdownForCycle(
  cycleId: string,
): Promise<PondCycleBreakdown[]> {
  const supabase = await createClient();

  const { data: stockRows, error: stockError } = await supabase
    .from("pond_cycle_stock")
    .select("*")
    .eq("cycle_id", cycleId);

  if (stockError) {
    console.error(stockError);
    return [];
  }

  if (!stockRows || stockRows.length === 0) return [];

  const pondIds = stockRows.map((row) => row.pond_id);

  const { data: ponds, error: pondsError } = await supabase
    .from("ponds")
    .select("id, name, code")
    .in("id", pondIds);

  if (pondsError) {
    console.error(pondsError);
    return [];
  }

  const pondMap = new Map((ponds ?? []).map((p) => [p.id, p]));

  return stockRows
    .map((row) => {
      const pond = pondMap.get(row.pond_id);
      return {
        pond_id: row.pond_id,
        pond_name: pond?.name ?? "Unknown pond",
        pond_code: pond?.code ?? null,
        stocked_in: row.stocked_in,
        transferred_in: row.transferred_in,
        transferred_out: row.transferred_out,
        total_mortality: row.total_mortality,
        total_harvested: row.total_harvested,
        current_fish_count: row.current_fish_count,
      };
    })
    .sort((a, b) => b.current_fish_count - a.current_fish_count);
}

export async function getTransfersForCycle(
  cycleId: string,
): Promise<CycleTransfer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stock_transfers")
    .select(
      `
      id, count, transfer_date, notes,
      from_pond:ponds!stock_transfers_from_pond_id_fkey(name),
      to_pond:ponds!stock_transfers_to_pond_id_fkey(name)
    `,
    )
    .eq("cycle_id", cycleId)
    .order("transfer_date", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    transfer_date: row.transfer_date,
    count: row.count,
    notes: row.notes,
    from_pond_name: row.from_pond?.name ?? "Unknown pond",
    to_pond_name: row.to_pond?.name ?? "Unknown pond",
  }));
}

export async function getAvailablePondsForCycleStocking(
  cycleId: string,
): Promise<AvailablePond[]> {
  const supabase = await createClient();

  const [
    { data: cycleStock, error: cycleStockError },
    { data: activePonds, error: activeError },
  ] = await Promise.all([
    supabase.from("pond_cycle_stock").select("pond_id").eq("cycle_id", cycleId),
    supabase
      .from("pond_current_stock")
      .select("pond_id, pond_name, status, cycle_id")
      .eq("status", "active"),
  ]);

  if (cycleStockError || activeError) {
    console.error(cycleStockError ?? activeError);
    return [];
  }

  const pondsAlreadyInThisCycle = new Set(
    (cycleStock ?? []).map((row) => row.pond_id),
  );

  return (activePonds ?? [])
    .filter((p) => p.cycle_id == null || pondsAlreadyInThisCycle.has(p.pond_id))
    .map((p) => ({ pond_id: p.pond_id, pond_name: p.pond_name }));
}

export interface CycleSummary {
  cycle_id: string;
  species: string;
  start_date: string;
  status: "active" | "completed";
  end_date: string | null;
  total_stocked: number;
  total_mortality: number;
  total_harvested: number;
  total_remaining: number;
  unaccounted_loss: number;
}

export async function getCycles(): Promise<CycleSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cycle_summary")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
