"use server";

import { createClient } from "@/lib/supabase/server";
import { newHarvestSchema } from "./schema";
import { resolveActiveCycleForPond } from "@/features/cycles/data";

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
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue.message,
      errorField: firstIssue.path[0] as keyof CreateHarvestInput,
    };
  }

  const resolution = await resolveActiveCycleForPond(parsed.data.pond_id);

  if (resolution.error === "NO_ACTIVE_CYCLE") {
    return {
      error: "This pond has no active cycle.",
      errorField: "pond_id" as const,
    };
  }

  if (resolution.error === "MULTIPLE_ACTIVE_CYCLES") {
    return {
      error: "A data integrity issue was detected. Please contact support.",
    };
  }

  if (resolution.error || !resolution.data) {
    return { error: "Could not verify pond stock. Please try again." };
  }

  const fishCount = Number(parsed.data.fish_count);

  if (fishCount > resolution.data.currentFishCount) {
    return {
      error: `Only ${resolution.data.currentFishCount} fish available in this pond.`,
      errorField: "fish_count" as const,
    };
  }

  const supabase = await createClient();
  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be signed in to record a harvest." };
  }

  const { error } = await supabase.from("harvests").insert({
    pond_id: parsed.data.pond_id,
    cycle_id: resolution.data.cycleId,
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
