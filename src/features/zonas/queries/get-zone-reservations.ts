"use server";
import { createClient } from "@/lib/supabase/server";

export async function getZoneReservations(zoneId: string, date: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("id, start_time, end_time, status")
    .eq("zone_id", zoneId)
    .eq("date", date)
    .in("status", ["pending", "confirmed"]);
  return data ?? [];
}
