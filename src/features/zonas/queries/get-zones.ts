"use server";
import { createClient } from "@/lib/supabase/server";

export async function getZones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("zones")
    .select("*")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}
