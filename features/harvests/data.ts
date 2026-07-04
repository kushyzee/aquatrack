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

export async function getHarvestRecords(): Promise<HarvestRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("harvests")
    .select(
      "id, harvest_date, quantity_kg, fish_count, revenue, buyer, notes, ponds(name)",
    )
    .order("harvest_date", { ascending: false });

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
    pond_name: (h.ponds as unknown as { name: string }[] | null)?.[0]?.name ?? null,
  }));
}
