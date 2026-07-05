import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AvailablePond {
  pond_id: string;
  pond_name: string;
}

export async function getAvailablePondsForStocking(): Promise<AvailablePond[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pond_current_stock")
    .select("pond_id, pond_name, status, cycle_id")
    .eq("status", "active");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? [])
    .filter((p) => p.cycle_id == null)
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
