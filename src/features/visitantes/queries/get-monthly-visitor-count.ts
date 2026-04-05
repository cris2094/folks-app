"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMonthlyVisitorCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return 0;
  const unitIds = residents.map((r) => r.unit_id);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { count } = await supabase
    .from("visitors")
    .select("id", { count: "exact", head: true })
    .in("unit_id", unitIds)
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  return count ?? 0;
}
