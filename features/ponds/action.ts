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

function makePondCode(name: string) {
  return name.trim().replace(/\s+/g, "-");
}

export async function createPondWithFormattedData(formData: FormDataProps) {
  const normalized = {
    formData,
    type: normalizePondType(formData.type),
    pondStatus: derivePondStatus(formData.initialStock),
    pondCode: makePondCode(formData.name),
  };

  const result = await newPondAction(normalized);

  if (result?.error && result.error.startsWith("duplicate key value")) {
    return {
      error: "A pond with this name already exists.",
      errorField: "name",
    };
  } else if (result?.error) {
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function newPondAction(normalized: Normalized) {
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
    console.log({ error });
    return { error: error.message };
  }
}
