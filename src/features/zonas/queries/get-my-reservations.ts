"use server";
import { createClient } from "@/lib/supabase/server";

export async function getMyReservations() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: residents } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return [];
  const residentIds = residents.map((r) => r.id);

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      `
      id,
      date,
      start_time,
      end_time,
      guests_count,
      status,
      notes,
      zone:zones (
        id,
        name,
        icon,
        price_cop
      )
    `,
    )
    .in("resident_id", residentIds)
    .order("date", { ascending: false })
    .limit(20);

  return reservations ?? [];
}
