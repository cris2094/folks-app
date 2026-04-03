"use server";

import { createClient } from "@/lib/supabase/server";
import { vehicleSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function addVehicle(unitId: string, residentId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Get tenant_id from resident
  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("id", residentId)
    .single();

  if (!resident) return { error: "Residente no encontrado" };

  const parsed = vehicleSchema.safeParse({
    plate: formData.get("plate"),
    type: formData.get("type"),
    color: formData.get("color") || null,
    brand: formData.get("brand") || null,
    parking_spot: formData.get("parking_spot") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("vehicles")
    .insert({
      ...parsed.data,
      tenant_id: resident.tenant_id,
      unit_id: unitId,
      resident_id: residentId,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/propiedad");
  return { success: true };
}

export async function removeVehicle(vehicleId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", vehicleId);

  if (error) return { error: error.message };

  revalidatePath("/propiedad");
  return { success: true };
}
