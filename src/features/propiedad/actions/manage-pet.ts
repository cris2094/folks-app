"use server";

import { createClient } from "@/lib/supabase/server";
import { petSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function addPet(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Derive resident from authenticated user
  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "No tienes un residente vinculado" };

  const parsed = petSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed") || null,
    vaccination_up_to_date: formData.get("vaccination_up_to_date") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("pets")
    .insert({
      ...parsed.data,
      tenant_id: resident.tenant_id,
      unit_id: resident.unit_id,
      resident_id: resident.id,
    });

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}

export async function removePet(petId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Verify pet belongs to user's units
  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return { error: "Sin residente vinculado" };
  const unitIds = residents.map((r) => r.unit_id);

  const { data, error } = await supabase
    .from("pets")
    .delete()
    .eq("id", petId)
    .in("unit_id", unitIds)
    .select("id")
    .single();

  if (error || !data) return { error: "Mascota no encontrada o no autorizado" };

  revalidatePath("/propiedad");
  return { success: true };
}
