"use server";
import { createClient } from "@/lib/supabase/server";

export async function getZoneDetails(zoneId: string) {
  const supabase = await createClient();
  const { data: zone } = await supabase
    .from("zones")
    .select("*")
    .eq("id", zoneId)
    .single();
  return zone;
}
