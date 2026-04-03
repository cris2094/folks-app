"use server";

import { createClient } from "@/lib/supabase/server";
import { petSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function addPet(unitId: string, residentId: string, formData: FormData) {
  const supabase = await createClient();

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("id", residentId)
    .single();

  if (!resident) return { error: "Residente no encontrado" };

  const parsed = petSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed") || null,
    vaccination_up_to_date: formData.get("vaccination_up_to_date") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("pets")
    .insert({
      ...parsed.data,
      tenant_id: resident.tenant_id,
      unit_id: unitId,
      resident_id: residentId,
    });

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}

export async function removePet(petId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("pets").delete().eq("id", petId);

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}
