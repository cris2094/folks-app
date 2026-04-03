"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUnitDetails(unitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { unit: null, residents: [], vehicles: [], pets: [] };

  // Verify user owns/belongs to this unit
  const { data: myResident } = await supabase
    .from("residents")
    .select("id, role")
    .eq("user_id", user.id)
    .eq("unit_id", unitId)
    .eq("is_active", true)
    .limit(1)
    .single();

  // Allow if user belongs to unit OR is admin
  if (!myResident) {
    const { data: adminCheck } = await supabase
      .from("residents")
      .select("role")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .in("role", ["admin", "super_admin"])
      .limit(1)
      .single();

    if (!adminCheck) {
      return { unit: null, residents: [], vehicles: [], pets: [] };
    }
  }

  const [
    { data: unit },
    { data: residents },
    { data: vehicles },
    { data: pets },
  ] = await Promise.all([
    supabase
      .from("units")
      .select("*")
      .eq("id", unitId)
      .single(),
    supabase
      .from("residents")
      .select("*")
      .eq("unit_id", unitId)
      .eq("is_active", true)
      .order("is_owner", { ascending: false }),
    supabase
      .from("vehicles")
      .select("*")
      .eq("unit_id", unitId),
    supabase
      .from("pets")
      .select("*")
      .eq("unit_id", unitId),
  ]);

  return {
    unit,
    residents: residents ?? [],
    vehicles: vehicles ?? [],
    pets: pets ?? [],
  };
}
