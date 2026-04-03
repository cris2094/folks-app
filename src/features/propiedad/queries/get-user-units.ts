"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserUnits() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("residents")
    .select(`
      id,
      role,
      is_owner,
      unit:units (
        id,
        tower,
        apartment,
        cadastral_number,
        area_m2,
        parking_spot,
        admin_fee_cop
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true);

  return data ?? [];
}
