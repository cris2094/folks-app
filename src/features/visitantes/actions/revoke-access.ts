"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function revokeAccess(formData: FormData) {
  const visitorId = formData.get("visitor_id") as string;
  if (!visitorId) return { error: "ID de visitante requerido" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "No tienes un residente vinculado" };

  // Set authorized_until to now to revoke
  const { error } = await supabase
    .from("visitors")
    .update({
      authorized_until: new Date().toISOString(),
      left_at: new Date().toISOString(),
    })
    .eq("id", visitorId)
    .eq("unit_id", resident.unit_id);

  if (error) return { error: error.message };

  // Log the revocation
  await supabase.from("access_logs").insert({
    tenant_id: resident.tenant_id,
    unit_id: resident.unit_id,
    visitor_id: visitorId,
    action: "exit",
    method: "app",
    registered_by: resident.id,
    notes: "Acceso revocado por residente",
  });

  revalidatePath("/visitantes");
  return { success: true };
}
