"use server";
import { createClient } from "@/lib/supabase/server";
import { reservationSchema } from "../schemas/zonas";
import { revalidatePath } from "next/cache";

export async function createReservation(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Derive resident from authenticated user — don't trust client input
  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "No tienes un residente vinculado" };

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
    unit_id: resident.unit_id,
    resident_id: resident.id,
    status: "confirmed",
  });

  if (error) return { error: error.message };

  revalidatePath("/zonas");
  return { success: true };
}
