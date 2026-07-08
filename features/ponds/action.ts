"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PondSchema,
  UpdatePondStatusInput,
  updatePondStatusSchema,
  type PondFormInput,
} from "./schema";
import { revalidatePath } from "next/cache";

function slugifyPondName(name: string) {
  return name.trim().replace(/\s+/g, "-");
}

async function makeUniquePondCode(name: string): Promise<string> {
  const supabase = await createClient();
  const baseCode = slugifyPondName(name);

  const { data: existing, error } = await supabase
    .from("ponds")
    .select("code")
    .ilike("code", `${baseCode}%`);

  if (error) {
    return baseCode;
  }

  const existingCodes = new Set((existing ?? []).map((p) => p.code));

  if (!existingCodes.has(baseCode)) {
    return baseCode;
  }

  let suffix = 2;
  while (existingCodes.has(`${baseCode}-${suffix}`)) {
    suffix++;
  }

  return `${baseCode}-${suffix}`;
}

type ActionResult =
  | { error: string; errorField?: keyof PondFormInput }
  | undefined;

export async function createPondAction(
  formData: PondFormInput,
  retryCode?: string,
  retryCount = 0,
): Promise<ActionResult> {
  const parsed = PondSchema.safeParse(formData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue.message,
      errorField: firstIssue.path[0] as keyof PondFormInput,
    };
  }

  const { name, type, description } = parsed.data;
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be signed in to create a pond." };
  }

  const pondCode = retryCode ?? (await makeUniquePondCode(name));

  const { error } = await supabase.from("ponds").insert({
    name,
    type,
    description: description || null,
    code: pondCode,
    created_by: userId,
  });

  if (error) {
    // 23505 = Postgres unique_violation
    if (error.code === "23505") {
      if (error.message.includes("ponds_name_key")) {
        return {
          error: "A pond with this name already exists.",
          errorField: "name",
        };
      }

      if (error.message.includes("ponds_code_unique") && retryCount < 3) {
        const nextCode = `${pondCode}-${retryCount + 2}`;
        return createPondAction(formData, nextCode, retryCount + 1);
      }
    }

    console.error({ error });
    return { error: "An unexpected error occurred. Please try again." };
  }
  revalidatePath("/ponds");
}

export async function updatePondStatusAction(
  input: UpdatePondStatusInput,
): Promise<ActionResult> {
  const parsed = updatePondStatusSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      error: firstIssue.message,
      errorField: firstIssue.path[0] as keyof UpdatePondStatusInput,
    };
  }

  const { pondId, status } = parsed.data;
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getClaims();
  const userId = currentUser?.claims.sub;

  if (!userId) {
    return { error: "You must be signed in to update a pond." };
  }

  if (status !== "active") {
    const { data: stock, error: stockError } = await supabase
      .from("pond_current_stock")
      .select("current_fish_count")
      .eq("pond_id", pondId)
      .single();

    if (stockError) {
      console.error({ stockError });
      return { error: "Could not verify pond stock. Please try again." };
    }

    if ((stock?.current_fish_count ?? 0) > 0) {
      return {
        error:
          "This pond still has fish from an active cycle. Harvest or transfer them out before changing its status.",
      };
    }
  }

  const { error } = await supabase
    .from("ponds")
    .update({ status })
    .eq("id", pondId);

  if (error) {
    console.error({ error });
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath(`/ponds/${pondId}`);
}
