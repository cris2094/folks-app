"use server";

import { createClient } from "@/lib/supabase/server";
import { residentSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function addResident(unitId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Verify user belongs to this unit or is admin
  const { data: myResident } = await supabase
    .from("residents")
    .select("id, tenant_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!myResident) return { error: "No tienes un residente vinculado" };

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

  const { error } = await supabase.from("residents").insert({
    ...parsed.data,
    tenant_id: myResident.tenant_id,
    unit_id: unitId,
    user_id: null,
    is_active: true,
    role: "residente",
  });

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}
