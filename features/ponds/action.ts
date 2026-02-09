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

export async function newPondAction(formData: FormDataProps) {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();
  const userId = currentUser?.user?.id;

  const { data, error, status } = await supabase.from("ponds").insert({
    name: formData.name,
    initial_fish_count: +formData.initialStock,
    type: formData.type,
    species: formData.species,
    stocking_date: formData.stockingDate,
    description: formData.description,
    status: "active",
    created_by: userId,
  });

  if (error) {
    console.log(error);
    return { error: error.message, success: false };

    // throw new Error(error.message);
  }

  console.log(data, status);
  return { success: true };
}
