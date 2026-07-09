"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { addStockSchema, newCycleSchema, transferStockSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { endCycleSchema } from "./schema";

interface CreateCycleInput {
  species: string;
  start_date: string;
  stockings: { pond_id: string; fish_count: string }[];
}

export async function endCycleAction(input: {
  cycleId: string;
  endDate: string;
}) {
  const parsed = endCycleSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("end_cycle", {
    p_cycle_id: parsed.data.cycleId,
    p_end_date: parsed.data.endDate,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/cycles/${parsed.data.cycleId}`);
  revalidatePath("/cycles");
  return { success: true };
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
  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be logged in to start a cycle." };
  }

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

export async function addStockToCycleAction(input: {
  cycle_id: string;
  stocking_date: string;
  stockings: { pond_id: string; fish_count: string }[];
}) {
  const parsed = addStockSchema.safeParse(input);

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

  const { error } = await supabase.rpc("add_stock_to_cycle", {
    p_cycle_id: parsed.data.cycle_id,
    p_stocking_date: parsed.data.stocking_date,
    p_created_by: userId,
    p_stockings: parsed.data.stockings.map((s) => ({
      pond_id: s.pond_id,
      fish_count: Number(s.fish_count),
    })),
  });

  if (error) {
    console.error({ error });
    if (error.message.includes("different active cycle")) {
      return {
        error:
          "One of the selected ponds already has a different active cycle. Please refresh and try again.",
      };
    }
    if (error.message.includes("completed cycle")) {
      return {
        error: "This cycle has already ended and can't receive more stock.",
      };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }

  return { success: true };
}

export async function transferStockAction(input: unknown) {
  const parsed = transferStockSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { cycleId, fromPondId, toPondId, count, transferDate, notes } =
    parsed.data;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: "You must be signed in to record a transfer.",
    };
  }

  const { data: fromStock, error: fromStockError } = await supabase
    .from("pond_cycle_stock")
    .select("current_fish_count")
    .eq("cycle_id", cycleId)
    .eq("pond_id", fromPondId)
    .maybeSingle();

  if (fromStockError || !fromStock) {
    return {
      success: false,
      error: "Could not verify stock for the source pond.",
    };
  }

  if (count > fromStock.current_fish_count) {
    return {
      success: false,
      error: `Only ${fromStock.current_fish_count} fish remain in the source pond for this cycle.`,
    };
  }

  const { data: toPond, error: toPondError } = await supabase
    .from("pond_current_stock")
    .select("status, cycle_id")
    .eq("pond_id", toPondId)
    .maybeSingle();

  if (toPondError || !toPond) {
    return { success: false, error: "Could not verify the destination pond." };
  }

  if (toPond.status !== "active") {
    return { success: false, error: "The destination pond is not active." };
  }

  if (toPond.cycle_id !== null && toPond.cycle_id !== cycleId) {
    return {
      success: false,
      error:
        "The destination pond already holds stock from a different active cycle.",
    };
  }

  const { error: insertError } = await supabase.from("stock_transfers").insert({
    cycle_id: cycleId,
    from_pond_id: fromPondId,
    to_pond_id: toPondId,
    count,
    transfer_date: transferDate,
    notes: notes || null,
    created_by: user.id,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath(`/cycles/${cycleId}`);
  return { success: true };
}
