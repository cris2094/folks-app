"use server";
import { createClient } from "@/lib/supabase/server";

export interface ZoneListItem {
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
}

export async function getZones(): Promise<ZoneListItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("zones")
    .select("id, name, description, icon, photo_url, price_cop, max_duration_hours, max_guests, max_reservations_per_month, is_active")
    .eq("is_active", true)
    .order("name");

  return (data as ZoneListItem[]) ?? [];
}
