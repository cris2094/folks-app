"use server";

import { createClient } from "@/lib/supabase/server";

export interface Neighbor {
  id: string;
  full_name: string;
  tower: string;
  apartment: string;
  is_owner: boolean;
}

export async function getNeighbors(): Promise<Neighbor[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get current user's tenant_id
  const { data: currentResident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!currentResident) return [];

  const { data } = await supabase
    .from("residents")
    .select(
      `
      id,
      full_name,
      is_owner,
      unit:units (
        tower,
        apartment
      )
    `,
    )
    .eq("tenant_id", currentResident.tenant_id)
    .eq("is_active", true)
    .order("full_name");

  if (!data) return [];

  return data.map((r: Record<string, unknown>) => {
    const unit = r.unit as { tower: string; apartment: string } | null;
    return {
      id: r.id as string,
      full_name: r.full_name as string,
      tower: unit?.tower ?? "",
      apartment: unit?.apartment ?? "",
      is_owner: r.is_owner as boolean,
    };
  });
}
