"use server";
import { createClient } from "@/lib/supabase/server";
import { reservationSchema } from "../schemas/zonas";
import { revalidatePath } from "next/cache";

export async function createReservation(
  unitId: string,
  residentId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("id", residentId)
    .single();
  if (!resident) return { error: "Residente no encontrado" };

  const parsed = reservationSchema.safeParse({
    zone_id: formData.get("zone_id"),
    date: formData.get("date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    guests_count: Number(formData.get("guests_count") ?? 0),
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("reservations").insert({
    ...parsed.data,
    tenant_id: resident.tenant_id,
    unit_id: unitId,
    resident_id: residentId,
    status: "confirmed",
  });

  if (error) return { error: error.message };

  revalidatePath("/zonas");
  return { success: true };
}
