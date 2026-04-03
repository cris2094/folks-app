"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function cancelReservation(reservationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Get user's resident IDs for ownership check
  const { data: residents } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return { error: "Sin residente vinculado" };
  const residentIds = residents.map((r) => r.id);

  // Only cancel if reservation belongs to user's residents
  const { data, error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .in("resident_id", residentIds)
    .select("id")
    .single();

  if (error || !data) return { error: "Reservacion no encontrada o no autorizado" };

  revalidatePath("/zonas");
  return { success: true };
}
