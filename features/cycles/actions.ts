"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { newCycleSchema } from "./schema";

interface CreateCycleInput {
  species: string;
  start_date: string;
  stockings: { pond_id: string; fish_count: string }[];
}

export async function createCycleAction(input: CreateCycleInput) {
  const parsed = newCycleSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    const properties = tree.properties as
      | Record<string, { errors: string[] } | undefined>
      | undefined;

    const firstFieldKey = Object.keys(properties ?? {})[0];
    const firstFieldError = firstFieldKey
      ? properties?.[firstFieldKey]?.errors[0]
      : undefined;

    return {
      error: firstFieldError ?? tree.errors[0] ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { data: currentUser } = await supabase.auth.getUser();
  const userId = currentUser?.user?.id;

  const { data, error } = await supabase.rpc("create_cycle_with_stockings", {
    p_species: parsed.data.species,
    p_start_date: parsed.data.start_date,
    p_created_by: userId,
    p_stockings: parsed.data.stockings.map((s) => ({
      pond_id: s.pond_id,
      fish_count: Number(s.fish_count),
    })),
  });

  if (error) {
    console.error({ error });
    if (error.message.includes("already has an active cycle")) {
      return {
        error:
          "One of the selected ponds already has an active cycle. Please refresh and try again.",
      };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }

  return { success: true, cycleId: data as string };
}
