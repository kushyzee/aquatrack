import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface HarvestRecord {
  id: string;
  harvest_date: string;
  quantity_kg: number;
  fish_count: number;
  revenue: number | null;
  buyer: string | null;
  notes: string | null;
  pond_name: string | null;
}

interface HarvestQueryRow extends Omit<HarvestRecord, "pond_name"> {
  ponds: { name: string } | null;
}

export interface PondWithStock {
  pond_id: string;
  pond_name: string;
  current_fish_count: number;
}

export interface HarvestTotals {
  total_weight_kg: number;
  total_quantity: number;
  total_revenue: number;
}

export async function getHarvestTotals(): Promise<HarvestTotals> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("harvest_totals")
    .select("*")
    .single();

  if (error || !data) {
    console.error(error);
    return { total_weight_kg: 0, total_quantity: 0, total_revenue: 0 };
  }

  return data;
}

export async function getActivePondsWithStock(): Promise<PondWithStock[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pond_current_stock")
    .select("pond_id, pond_name, current_fish_count")
    .eq("status", "active")
    .order("pond_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getHarvestRecords(): Promise<HarvestRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("harvests")
    .select(
      "id, harvest_date, quantity_kg, fish_count, revenue, buyer, notes, ponds(name)",
    )
    .order("harvest_date", { ascending: false })
    .overrideTypes<HarvestQueryRow[]>();

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((h) => ({
    id: h.id,
    harvest_date: h.harvest_date,
    quantity_kg: h.quantity_kg,
    fish_count: h.fish_count,
    revenue: h.revenue,
    buyer: h.buyer,
    notes: h.notes,
    pond_name: h.ponds?.name ?? null,
  }));
}
