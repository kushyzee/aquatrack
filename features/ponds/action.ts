"use server";

import { createClient } from "@/lib/supabase/server";
import { PondSchema, type PondFormInput } from "./schema";
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
