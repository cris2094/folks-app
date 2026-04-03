"use server";
import { createClient } from "@/lib/supabase/server";

export interface ZoneDetail {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  photo_url: string | null;
  price_cop: number;
  max_duration_hours: number;
  max_guests: number;
  max_reservations_per_month: number;
  is_active: boolean;
  schedule: Record<string, { open: string; close: string } | null> | null;
}

export async function getZoneDetails(zoneId: string): Promise<ZoneDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("zones")
    .select("id, name, description, icon, photo_url, price_cop, max_duration_hours, max_guests, max_reservations_per_month, is_active, schedule")
    .eq("id", zoneId)
    .single();

  return data as ZoneDetail | null;
}
