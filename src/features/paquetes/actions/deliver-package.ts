"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deliverPackage(packageId: string, deliveredTo: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || (resident.role !== "portero" && resident.role !== "admin" && resident.role !== "super_admin")) {
    return { error: "No autorizado" };
  }

  // Scope to same tenant to prevent cross-tenant manipulation
  const { error } = await supabase
    .from("packages")
    .update({
      status: "delivered",
      delivered_at: new Date().toISOString(),
      delivered_to: deliveredTo,
    })
    .eq("id", packageId)
    .eq("tenant_id", resident.tenant_id);

  if (error) return { error: error.message };

  revalidatePath("/paquetes");
  return { success: true };
}
