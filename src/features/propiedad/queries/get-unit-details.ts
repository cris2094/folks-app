"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUnitDetails(unitId: string) {
  const supabase = await createClient();

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
