"use server";
import { createClient } from "@/lib/supabase/server";
import { authorizeVisitorSchema } from "../schemas/visitantes";
import { revalidatePath } from "next/cache";

export async function authorizeVisitor(formData: FormData) {
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

  // Validate monthly limit (max 5 visitors per month per unit)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { count: monthlyCount } = await supabase
    .from("visitors")
    .select("id", { count: "exact", head: true })
    .eq("unit_id", resident.unit_id)
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  if ((monthlyCount ?? 0) >= 5) {
    return { error: "Has alcanzado el limite de 5 visitantes este mes" };
  }

  const parsed = authorizeVisitorSchema.safeParse({
    full_name: formData.get("full_name"),
    document_number: formData.get("document_number"),
    phone: formData.get("phone") || null,
    relationship: formData.get("relationship"),
    access_date: formData.get("access_date"),
    is_favorite: formData.get("is_favorite") === "on",
    is_temporary: formData.get("is_temporary") === "on",
    expires_at: formData.get("expires_at") || null,
    vehicle_plate: formData.get("vehicle_plate") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("visitors").insert({
    tenant_id: resident.tenant_id,
    unit_id: resident.unit_id,
    authorized_by: resident.id,
    full_name: parsed.data.full_name,
    document_number: parsed.data.document_number,
    phone: parsed.data.phone ?? null,
    reason: parsed.data.relationship,
    is_favorite: parsed.data.is_favorite,
    authorized_until: parsed.data.access_date,
    expires_at: parsed.data.is_temporary ? parsed.data.expires_at : null,
    vehicle_plate: parsed.data.vehicle_plate ?? null,
  });

  if (error) return { error: error.message };

  // Also add to frequent contacts if marked as favorite
  if (parsed.data.is_favorite) {
    await supabase.from("frequent_contacts").insert({
      tenant_id: resident.tenant_id,
      resident_id: resident.id,
      name: parsed.data.full_name,
      document: parsed.data.document_number,
      phone: parsed.data.phone ?? null,
      relationship: parsed.data.relationship,
      is_favorite: true,
    });
  }

  // Log the access authorization
  await supabase.from("access_logs").insert({
    tenant_id: resident.tenant_id,
    unit_id: resident.unit_id,
    action: "entry",
    method: "app",
    registered_by: resident.id,
    notes: `Autorizado: ${parsed.data.full_name}`,
  });

  revalidatePath("/visitantes");
  return { success: true };
}
