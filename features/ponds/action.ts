"use server";

import { createClient } from "@/lib/supabase/server";

interface FormDataProps {
  name: string;
  initialStock: string;
  type: string;
  species: string;
  stockingDate: string;
  description: string;
}

interface Normalized {
  formData: FormDataProps;
  type: string;
  pondStatus: string;
  pondCode: string;
}

function normalizePondType(type: string) {
  const map: Record<string, string> = {
    concrete: "Concrete Tank",
    earthen: "Earthen Pond",
    plastic: "Plastic Tank",
    tarpaulin: "Tarpaulin Tank",
  };
  return map[type] ?? "Concrete Tank";
}

function derivePondStatus(initialStock: string) {
  return Number(initialStock) < 1 ? "inactive" : "active";
}

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

export async function createPondWithFormattedData(formData: FormDataProps) {
  const pondCode = await makeUniquePondCode(formData.name);

  const normalized: Normalized = {
    formData,
    type: normalizePondType(formData.type),
    pondStatus: derivePondStatus(formData.initialStock),
    pondCode,
  };

  const result = await newPondAction(normalized);

  if (result?.error) {
    return result;
  }
}

export async function newPondAction(
  normalized: Normalized,
  retryCount = 0,
): Promise<{ error?: string; errorField?: string } | undefined> {
  const { formData, pondCode, pondStatus, type } = normalized;

  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();
  const userId = currentUser?.user?.id;

  const { error } = await supabase.from("ponds").insert({
    name: formData.name.trim(),
    initial_fish_count: Number(formData.initialStock.trim()) ?? 0,
    type,
    species: formData.species || "Catfish",
    stocking_date: formData.stockingDate,
    description: formData.description || null,
    status: pondStatus,
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

      if (error.message.includes("ponds_code_unique")) {
        if (retryCount < 3) {
          const nextCode = `${pondCode}-${retryCount + 2}`;
          return newPondAction(
            { ...normalized, pondCode: nextCode },
            retryCount + 1,
          );
        }
      }
    }

    console.error({ error });
    return { error: "An unexpected error occurred. Please try again." };
  }
}
