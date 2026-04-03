"use server";

import { createClient } from "@/lib/supabase/server";
import { residentSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function updateResident(residentId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Verify target resident belongs to user's unit or user is admin
  const { data: myResidents } = await supabase
    .from("residents")
    .select("unit_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!myResidents?.length) return { error: "Sin residente vinculado" };

  const isAdmin = myResidents.some((r) => r.role === "admin" || r.role === "super_admin");
  const myUnitIds = myResidents.map((r) => r.unit_id);

  // Check target resident is in user's units (or user is admin)
  const { data: targetResident } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("id", residentId)
    .single();

  if (!targetResident) return { error: "Residente no encontrado" };

  if (!isAdmin && !myUnitIds.includes(targetResident.unit_id)) {
    return { error: "No autorizado para editar este residente" };
  }

  const parsed = residentSchema.safeParse({
    full_name: formData.get("full_name"),
    document_type: formData.get("document_type"),
    document_number: formData.get("document_number"),
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    is_owner: formData.get("is_owner") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("residents")
    .update(parsed.data)
    .eq("id", residentId);

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}
