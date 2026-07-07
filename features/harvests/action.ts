"use server";

import { createClient } from "@/lib/supabase/server";
import { newHarvestSchema } from "./schema";

interface CreateHarvestInput {
  pond_id: string;
  harvest_date: string;
  quantity_kg: string;
  fish_count: string;
  revenue: string;
  buyer: string;
  notes: string;
}

export async function createHarvestAction(input: CreateHarvestInput) {
  const parsed = newHarvestSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstField = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
    return {
      error:
        (firstField ? fieldErrors[firstField]?.[0] : undefined) ??
        "Invalid input.",
      errorField: firstField,
    };
  }

  const supabase = await createClient();

  const { data: stock, error: stockError } = await supabase
    .from("pond_current_stock")
    .select("current_fish_count")
    .eq("pond_id", parsed.data.pond_id)
    .single();

  if (stockError || !stock) {
    return { error: "Could not verify pond stock. Please try again." };
  }

  const fishCount = Number(parsed.data.fish_count);
  if (fishCount > stock.current_fish_count) {
    return {
      error: `Only ${stock.current_fish_count} fish available in this pond.`,
      errorField: "fish_count",
    };
  }

  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be logged in to start a harvest." };
  }

  const { error } = await supabase.from("harvests").insert({
    pond_id: parsed.data.pond_id,
    harvest_date: parsed.data.harvest_date,
    quantity_kg: Number(parsed.data.quantity_kg),
    fish_count: fishCount,
    revenue: parsed.data.revenue ? Number(parsed.data.revenue) : null,
    buyer: parsed.data.buyer || null,
    notes: parsed.data.notes || null,
    created_by: userId,
  });

  if (error) {
    console.error({ error });
    return { error: "An unexpected error occurred. Please try again." };
  }

  return { success: true };
}
