"use server";
import { createClient } from "@/lib/supabase/server";
import { registerPackageSchema } from "../schemas/paquetes";
import { revalidatePath } from "next/cache";

export async function registerPackage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "Sin residente vinculado" };
  if (resident.role !== "portero" && resident.role !== "admin" && resident.role !== "super_admin") {
    return { error: "Solo porteros y administradores pueden registrar paquetes" };
  }

  const parsed = registerPackageSchema.safeParse({
    unit_id: formData.get("unit_id"),
    description: formData.get("description"),
    received_by: formData.get("received_by"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("packages").insert({
    ...parsed.data,
    tenant_id: resident.tenant_id,
    status: "received",
  });

  if (error) return { error: error.message };

  revalidatePath("/paquetes");
  return { success: true };
}
