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

export async function createPondWithFormattedData(formData: FormDataProps) {
  switch (formData.type) {
    case "concrete":
      formData.type = "Concrete Tank";
      break;
    case "earthen":
      formData.type = "Earthen Pond";
      break;
    case "plastic":
      formData.type = "Plastic Tank";
      break;
    case "tarpaulin":
      formData.type = "Tarpaulin Tank";
      break;
    default:
      formData.type = "Concrete Tank";
      break;
  }

  let pondStatus = "active";
  if (Number(formData.initialStock) < 1) {
    pondStatus = "inactive";
  }

  const pondCode = formData.name.trim().replace(" ", "-");

  const result = await newPondAction(formData, pondStatus, pondCode);

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

export async function newPondAction(
  formData: FormDataProps,
  pondStatus: string,
  pondCode: string,
) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();
  const userId = currentUser?.user?.id;

  const { error } = await supabase.from("ponds").insert({
    name: formData.name.trim(),
    initial_fish_count: Number(formData.initialStock.trim()) ?? 0,
    type: formData.type,
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
