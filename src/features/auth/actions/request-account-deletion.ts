"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requestAccountDeletion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get resident info
  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, unit_id, full_name, email")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) {
    return { error: "No se encontro tu perfil de residente." };
  }

  // Create a special ticket for account deletion
  const { error } = await supabase.from("tickets").insert({
    tenant_id: resident.tenant_id,
    unit_id: resident.unit_id,
    resident_id: resident.id,
    category: "other",
    priority: "high",
    subject: "Solicitud de eliminacion de cuenta",
    description: `El residente ${resident.full_name} (${resident.email ?? user.email}) solicita la eliminacion de su cuenta y todos sus datos personales conforme al derecho de supresion (Ley 1581 de 2012, Art. 8). User ID: ${user.id}`,
    status: "open",
  });

  if (error) {
    return { error: "No se pudo procesar la solicitud. Intenta de nuevo." };
  }

  return { success: true };
}
